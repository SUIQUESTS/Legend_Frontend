import React from 'react';
import { ScrollIcon, HammerIcon, TrophyIcon } from './icons';
import { useOnScreen } from '../hooks/useOnScreen';

// Fix: Changed icon type to be more specific to allow cloning with props.
interface StepCardProps {
  step: number;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  iconTooltip: string;
}

const ConfettiBurst: React.FC = () => {
    const confettiCount = 20;
    const colors = ['#00f5ff', '#00ffcc', '#fbbf24']; // accent, accent-soft, amber
    
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {Array.from({ length: confettiCount }).map((_, i) => {
                const angle = (i / confettiCount) * 360 + (Math.random() - 0.5) * 10;
                const distance = Math.random() * 80 + 50; // 50px to 130px distance
                const x = Math.cos(angle * Math.PI / 180) * distance;
                const y = Math.sin(angle * Math.PI / 180) * distance;
                const size = Math.random() * 6 + 4; // 4px to 10px size
                const delay = Math.random() * 0.2;

                return (
                    <div
                        key={i}
                        className="confetti"
                        style={{
                            '--confetti-x': `${x}px`,
                            '--confetti-y': `${y}px`,
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: colors[i % colors.length],
                            animationDelay: `${delay}s`,
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};

const StepCard: React.FC<StepCardProps> = ({ step, icon, title, description, iconTooltip }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
    
    return (
        <div 
          ref={ref}
          className={`relative p-6 sm:p-8 bg-surface rounded-2xl border border-border transition-all duration-500 ease-out group hover:border-accent-soft/50 hover:-translate-y-1.5 overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: isVisible ? `${step * 150}ms` : '0ms' }}
        >
          {step === 3 && <ConfettiBurst />}
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.05)_45%,rgba(255,255,255,0.05)_55%,transparent_80%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/10 via-accent/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
          
          <div style={{  fontFamily: "helvetica" }} className="relative z-10">
            <div className="relative group/icon mb-6 w-16 h-16 flex items-center justify-center bg-background rounded-xl border-2 border-border text-accent-soft group-hover:text-accent group-hover:border-accent/30 transition-all duration-300">
                <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-accent text-background text-xs font-bold rounded-md shadow-lg opacity-0 group-hover/icon:opacity-100 group-hover/icon:-translate-y-1 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                    {iconTooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-accent"></div>
                </div>
                
                {React.cloneElement(icon, { 
                    className: `w-8 h-8 transform transition-transform duration-500 group-hover:scale-110 ${step === 3 ? 'group-hover:-translate-y-2' : ''}` 
                })}
                {/* Light beam effect for the trophy (step 3) */}
                {step === 3 && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center items-end overflow-hidden pointer-events-none">
                        <div 
                            className="w-0.5 h-full bg-gradient-to-t from-amber-400/80 to-transparent transform rotate-[-25deg] translate-x-1 scale-y-0 group-hover:scale-y-100 transition-all duration-500 origin-bottom delay-100"
                        ></div>
                        <div 
                            className="w-1 h-full bg-gradient-to-t from-amber-300 to-transparent transform scale-y-0 group-hover:scale-y-100 transition-all duration-500 origin-bottom"
                        ></div>
                        <div 
                            className="w-0.5 h-full bg-gradient-to-t from-amber-400/80 to-transparent transform rotate-[25deg] -translate-x-1 scale-y-0 group-hover:scale-y-100 transition-all duration-500 origin-bottom delay-100"
                        ></div>
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-primary">0{step}. {title}</h3>
            <p className="text-secondary leading-relaxed text-sm sm:text-base">{description}</p>
          </div>
        </div>
    );
};

const HowItWorksSection: React.FC = () => {
    const [titleRef, isTitleVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });
    const steps = [
        {
            icon: <ScrollIcon />,
            title: "Accept the Quest",
            description: "Browse the live quest board and accept a challenge that calls to your skills and ambition.",
            iconTooltip: "Represents a Quest Scroll"
        },
        {
            icon: <HammerIcon />,
            title: "Forge Your Legend",
            description: "Complete the quest objectives, submit your proof, and carve your name into the Sui blockchain.",
            iconTooltip: "Represents Forging/Building"
        },
        {
            icon: <TrophyIcon />,
            title: "Enter the Hall",
            description: "Successful deeds are immortalized. Earn glory, rewards, and a place among the legends.",
            iconTooltip: "Represents Victory & Glory"
        }
    ];

    return (
        <section id="how-it-works" className="py-16 sm:py-20 md:py-28 bg-surface-dark/30">
            <div className="container mx-auto px-6">
                <div 
                    ref={titleRef} 
                    className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-primary">Forge Your Legacy</h2>
                    <p style={{  fontFamily: "helvetica" }} className="mt-4 text-base sm:text-lg text-secondary max-w-2xl mx-auto">Three steps to eternal glory on the blockchain.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {steps.map((step, index) => (
                        <StepCard key={step.title} {...step} step={index + 1} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
