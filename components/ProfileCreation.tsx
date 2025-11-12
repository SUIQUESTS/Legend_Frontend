import React, { useState, useEffect, useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { useCurrentAccount } from "@mysten/dapp-kit";
import axios from 'axios';

interface ProfileCreationProps {
  onProfileCreated: (userData: UserData) => void;
}

interface UserData {
  id: string;
  walletAddress: string;
  name: string;
  score: number;
}

const ProfileCreation: React.FC<ProfileCreationProps> = ({ onProfileCreated }) => {
    // Fix: Changed HTMLDivElement to HTMLElement to correctly type the ref for a <section> element.
    const [ref, isVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
    const [error, setError] = useState<string | null>(null);
    const currentAccount = useCurrentAccount();
    
    // Debounce timer
    const debounceTimeout = useRef<number | null>(null);

    // Mock availability check
    const checkUsernameAvailability = async (name: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const isTaken = ['admin', 'legend', 'sui'].includes(name.toLowerCase());
                resolve(!isTaken);
            }, 500);
        });
    };
    
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
        setUsername(value);
        setStatus('checking');
        setError(null);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!value) {
            setStatus('idle');
            return;
        }

        if (value.length < 3) {
            setStatus('invalid');
            setError('Username must be at least 3 characters.');
            return;
        }

        if (value.length > 15) {
            setStatus('invalid');
            setError('Username cannot exceed 15 characters.');
            return;
        }

        debounceTimeout.current = window.setTimeout(async () => {
            const isAvailable = await checkUsernameAvailability(value);
            if (isAvailable) {
                setStatus('available');
            } else {
                setStatus('taken');
                setError('This username is already taken.');
            }
        }, 500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'available' && username) {
        try {        

            const payload = {
                name: username,
                walletAddress: currentAccount.address
            }
        const { data } = await axios.post("https://legendbackend-a29sm.sevalla.app/api/users/", payload)

        const userData: UserData = data;
        onProfileCreated(userData); // This should navigate to dashboard
        } catch (error) {
        console.error('Error creating profile:', error);
        // Handle error (show error message to user)
        }
    }
    };
    // Re-use particle effect from HeroSection
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        class Particle {
            x: number; y: number; vx: number; vy: number; radius: number; color: string;
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.5; this.color = 'rgba(255, 255, 255, 0.2)';
            }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
            update() {
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx; if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
                this.x += this.vx; this.y += this.vy; this.draw();
            }
        }
        let particles = Array.from({ length: 150 }, () => new Particle());
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
        };
        const handleResize = () => {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            particles = Array.from({ length: 150 }, () => new Particle());
        };
        window.addEventListener('resize', handleResize);
        animate();
        return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId); };
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'checking': return 'border-yellow-500/50 focus:ring-yellow-500/50';
            case 'available': return 'border-green-500/50 focus:ring-green-500/50';
            case 'taken':
            case 'invalid': return 'border-red-500/50 focus:ring-red-500/50';
            default: return 'border-border focus:ring-accent/50';
        }
    }

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-background">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-50"></canvas>
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-grid-pattern bg-grid-size opacity-50"></div>
             <div 
                className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 -z-10 rounded-full bg-gradient-to-r from-accent/5 via-surface/5 to-surface/5 blur-3xl"
                style={{ animation: `aurora 20s infinite linear`, backgroundSize: '400% 400%' }}>
            </div>
            
            <div className={`relative z-10 w-full max-w-md text-center bg-surface/80 backdrop-blur-lg border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-accent/10 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    Forge Your Identity
                </h1>
                <p className="text-secondary mb-6 sm:mb-8 text-sm sm:text-base">Claim your unique name on the ledger of Legends.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold text-secondary">@</span>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="your_legend"
                            maxLength={15}
                            className={`w-full bg-background border-2 rounded-lg text-xl sm:text-2xl font-bold font-heading text-primary pl-8 sm:pl-10 pr-10 sm:pr-12 py-3 sm:py-4 text-center focus:outline-none focus:ring-4 transition-all duration-300 ${getStatusColor()}`}
                        />
                         <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                            {status === 'checking' && <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-yellow-500/50 border-t-yellow-500 rounded-full animate-spin"></div>}
                            {status === 'available' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 w-5 sm:w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                            {(status === 'taken' || status === 'invalid') && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 w-5 sm:w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {!error && status === 'available' && <p className="text-green-500 text-sm mt-2">@{username} is available!</p>}

                    <button
                        type="submit"
                        disabled={status !== 'available'}
                        className="w-full mt-6 group relative font-bold text-base sm:text-lg text-primary px-6 sm:px-8 py-3 sm:py-4 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none overflow-hidden"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.2)_55%,transparent_80%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                        <span className="relative z-10">Claim My Name</span>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ProfileCreation;