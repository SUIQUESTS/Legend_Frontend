import React from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { CheckCircleIcon, SparklesIcon, ShieldCheckIcon, SuiCoinIcon, TrophyIcon } from './icons';
import { WalletConnection } from './WalletConnection';

const FeatureHighlight: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div style={{  fontFamily: "helvetica" }} className="flex items-center gap-3">
        <div className="text-blue-400 w-6 h-6">{icon}</div>
        <span className="text-secondary">{text}</span>
    </div>
);

interface UserData {
  id: string;
  walletAddress: string;
  name: string;
  score: number;
}

interface HeroSectionProps {
  onEnter: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToDashboard?: (userData: UserData) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  onEnter, 
  onNavigateToProfile = () => {}, 
  onNavigateToDashboard = () => {} 
}) => {
    const [ref, isVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,255,0.1),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-grid-pattern bg-grid-size"></div>
        <div 
            className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 -z-10 rounded-full bg-gradient-to-r from-accent-soft/5 via-accent/5 to-surface/5 blur-3xl"
            style={{
                animation: `aurora 20s infinite linear`,
                backgroundSize: '400% 400%'
            }}>
        </div>

      <div className="container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-3 text-center lg:text-left lg:pt-10">
                 <h1 className={`text-6xl md:text-8xl font-black tracking-tighter uppercase font-heading transition-all duration-700 bg-gradient-to-b from-primary to-slate-400 bg-clip-text text-transparent ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    LEGENDS
                </h1>
                <p className={`mt-4 text-xl md:text-2xl text-accent-soft font-heading transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    Where Deeds Earn Eternal Glory
                </p>
                <p style={{  fontFamily: "helvetica" }} className={`mt-6  text-lg md:text-xl text-secondary max-w-2xl mx-auto lg:mx-0 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    Complete challenges. Earn your place in history. Prove your skills and become a part of the permanent ledger of the Sui blockchain.
                </p>
                <div className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <WalletConnection 
                      onNavigateToProfile={onNavigateToProfile}
                      onNavigateToDashboard={onNavigateToDashboard}
                    />
                    <a
                        style={{ fontFamily: "helvetica" }}
                        href="#how-it-works"
                        className="font-semibold px-8 py-3 bg-surface text-primary rounded-xl hover:bg-surface/80 focus:outline-none focus:ring-4 focus:ring-border transition-colors duration-300"
                    >
                        Learn More
                    </a>
                </div>
                 <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                    <FeatureHighlight icon={<SparklesIcon />} text="On-Chain Glory" />
                    <FeatureHighlight icon={<CheckCircleIcon />} text="Verifiable Achievements" />
                    <FeatureHighlight icon={<ShieldCheckIcon />} text="Secured by Sui" />
                </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="hidden lg:block lg:col-span-2 relative h-[600px]">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-3'}`}>
                    
                    {/* Phone Mockup */}
                    <div style={{  fontFamily: "helvetica" }} className="absolute w-[300px] h-[600px] top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface backdrop-blur-md rounded-[40px] border border-border shadow-2xl shadow-accent/10 p-4 animate-[float_6s_ease-in-out_infinite] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-accent/20">
                        <div className="w-full h-full bg-background rounded-[28px] overflow-hidden">
                            {/* Phone Screen Content */}
                            <div className="p-6 h-full flex flex-col">
                                <div className="text-center mt-8">
                                    <img className="w-24 h-24 rounded-full mx-auto ring-2 ring-accent-soft/50" src="https://picsum.photos/seed/legend/100" alt="Legend" />
                                    <h3 className="text-2xl font-bold font-heading mt-4">@CyberGlory</h3>
                                    <p className="text-secondary">Chain Champion</p>
                                </div>
                                <div className="mt-8 space-y-4">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-secondary">Quests:</span>
                                        <span className="font-bold text-primary">42</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-secondary">Rank:</span>
                                        <span className="font-bold text-amber-400">#1</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-secondary">Score:</span>
                                        <span className="font-bold text-primary">9,850</span>
                                    </div>
                                </div>
                                <div className="mt-auto flex justify-center pb-4">
                                    <button className="px-10 py-3 bg-surface border border-border rounded-full font-semibold text-base transform hover:scale-105 hover:bg-border transition-all">View Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating UI Elements */}
                    <div className={`absolute -top-8 -left-16 w-64 bg-surface backdrop-blur-md rounded-2xl border border-border shadow-lg p-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ animation: `float 6s 0.5s ease-in-out infinite` }}>
                        <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-8 h-8 text-green-400" />
                            <div style={{  fontFamily: "helvetica" }}>
                                <p className="font-semibold">Quest Complete</p>
                                <p className="text-sm text-secondary">Master the Sui SDK</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`absolute top-1/2 -right-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ animation: `float 6s 1s ease-in-out infinite` }}>
                        {/* <div className="w-24 h-24 bg-surface backdrop-blur-md rounded-full border border-border shadow-lg flex items-center justify-center">
                            <TrophyIcon className="w-12 h-12 text-amber-400" />
                        </div> */}
                    </div>

                    <div className={`absolute -bottom-8 right-0 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ animation: `float 6s 1.5s ease-in-out infinite` }}>
                        <div className="flex items-center gap-3 w-48 bg-surface backdrop-blur-md rounded-2xl border border-border shadow-lg p-3">
                            <SuiCoinIcon className="w-8 h-8 text-accent-soft" />
                            <div style={{  fontFamily: "helvetica" }}>
                                <p className="font-semibold">+100 SUI</p>
                                <p className="text-sm text-secondary">Reward Claimed</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;