import React from 'react';
import Tooltip from '../Tooltip';

export interface Quest {
    id: number;
    title: string;
    category: string;
    progress?: number;
    difficulty: string;
    participants: number;
    creator: string;
    status: 'Live' | 'Judging' | 'Completed';
    winner?: string | null;
    nftBadge: {
        name: string;
        image: string;
        points: number;
    };
}

interface QuestCardProps {
    quest: Quest;
    index: number;
    isVisible: boolean;
    onJoin?: (quest: Quest) => void;
    participationStatus?: 'joined' | 'not_joined';
}

const difficultyColor: { [key: string]: string } = {
    "Easy": "bg-green-500/10 text-green-400 border border-green-500/20",
    "Medium": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    "Hard": "bg-red-500/10 text-red-400 border border-red-500/20",
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, index, isVisible, onJoin, participationStatus = 'not_joined' }) => {

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -1 * ((y - rect.height / 2) / (rect.height / 2)) * 6;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const isJoined = participationStatus === 'joined';

    let buttonText = "Join Quest";
    let buttonDisabled = false;
    let buttonTooltip = "Join this quest and earn your glory!";

    if (quest.progress !== undefined && quest.progress > 0) {
        buttonText = "Continue";
        buttonTooltip = `You are ${quest.progress}% complete. Continue your quest!`;
    } else if (isJoined) {
        buttonText = "View Submission";
        buttonDisabled = true;
        buttonTooltip = "You have already submitted an entry for this quest.";
    }

    const handleButtonClick = () => {
        if (buttonText === "Join Quest" && onJoin) {
            onJoin(quest);
        } else if (buttonText === "Continue") {
            // Placeholder for future navigation/action
            console.log("Continuing quest:", quest.id);
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative bg-surface border border-border rounded-xl shadow-lg transition-all duration-500 ease-out group overflow-hidden ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            style={{
               transitionProperty: 'opacity, transform',
               transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_250px_at_var(--x)_var(--y),_rgba(56,123,255,0.1),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
            <div className="p-6 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <span style={{ fontFamily: "helvetica" }} className="text-xs font-bold uppercase tracking-widest text-accent">{quest.category}</span>
                    <span style={{ fontFamily: "helvetica" }} className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColor[quest.difficulty]}`}>{quest.difficulty}</span>
                </div>
                <h3 className="text-xl font-bold font-heading text-primary mb-2 h-14 flex-shrink-0">{quest.title}</h3>
                
                <div style={{ fontFamily: "helvetica" }} className="flex justify-between items-center bg-background p-3 rounded-lg my-4">
                    <div className="flex items-center gap-3">
                        <img src={quest.nftBadge.image} alt={quest.nftBadge.name} className="w-10 h-10 rounded-md object-cover border-2 border-accent/30" />
                        <div>
                            <p className="text-xs text-secondary">NFT Badge</p>
                            <p className="font-bold text-accent">{quest.nftBadge.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-secondary">Points</p>
                        <p className="font-bold text-primary text-lg">{quest.nftBadge.points}</p>
                    </div>
                </div>

                {quest.progress !== undefined && quest.progress > 0 && (
                     <div style={{ fontFamily: "helvetica" }} className="mt-auto mb-4">
                        <div className="flex justify-between text-xs text-secondary mb-1">
                            <span>Progress</span>
                            <span>{quest.progress}%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                            <div className="bg-accent h-full rounded-full" style={{ width: `${quest.progress}%` }}></div>
                        </div>
                    </div>
                )}
                
                <div className="flex-grow"></div>
                
                <div style={{ fontFamily: "helvetica" }} className="flex justify-between items-center mt-auto">
                    <span className="text-secondary text-sm">Participants: <span className="font-bold text-primary">{quest.participants}</span></span>
                     <Tooltip content={buttonTooltip}>
                        <button 
                            onClick={handleButtonClick}
                            disabled={buttonDisabled}
                            className={`px-4 py-2 font-bold rounded-lg text-sm transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-accent/50 ${
                                buttonDisabled 
                                ? 'bg-surface text-secondary cursor-not-allowed' 
                                : buttonText === 'Continue'
                                ? 'bg-surface border border-border text-primary hover:bg-border'
                                : 'bg-accent text-primary hover:scale-105 hover:shadow-glow-accent'
                            }`}
                        >
                            {buttonText}
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default QuestCard;