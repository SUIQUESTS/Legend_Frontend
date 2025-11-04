import React from 'react';
import { Quest } from './QuestCard';
import { UsersIcon, CheckCircleIcon, TrophyIcon } from '../icons';
import Tooltip from '../Tooltip';

interface MyQuestCardProps {
    quest: Quest;
    submissionCount: number;
    index: number;
    onViewSubmissions: () => void;
}

const statusConfig = {
    Live: {
        text: 'Live',
        color: 'bg-green-500/10 text-green-400 border-green-500/30',
        icon: <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>,
    },
    Judging: {
        text: 'Judging',
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        icon: <UsersIcon className="w-4 h-4" />,
    },
    Completed: {
        text: 'Completed',
        color: 'bg-primary/10 text-primary border-primary/30',
        icon: <CheckCircleIcon className="w-4 h-4" />,
    },
};


const MyQuestCard: React.FC<MyQuestCardProps> = ({ quest, submissionCount, index, onViewSubmissions }) => {
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -1 * ((y - rect.height / 2) / (rect.height / 2)) * 5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    const currentStatus = statusConfig[quest.status];

    return (
        <div 
            className="relative bg-surface border border-border rounded-xl shadow-lg transition-all duration-500 ease-out group overflow-hidden flex flex-col"
            style={{ 
                animation: `slide-in-fade 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
             <div className="absolute inset-0 bg-[radial-gradient(circle_250px_at_var(--x)_var(--y),_rgba(56,123,255,0.05),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
             <div className="p-5 relative z-20 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">{quest.category}</span>
                    <div className={`flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-full border ${currentStatus.color}`}>
                        {currentStatus.icon}
                        <span>{currentStatus.text}</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold font-heading text-primary flex-grow">{quest.title}</h3>
                
                {quest.status === 'Completed' && quest.winner && (
                     <div className="my-4 p-3 bg-background rounded-lg flex items-center gap-3 border border-border">
                        <TrophyIcon className="w-6 h-6 text-amber-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-secondary">Winner</p>
                            <p className="font-bold text-primary">{quest.winner}</p>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                     <Tooltip content="Total submissions received">
                        <div className="flex items-center gap-2 text-secondary">
                            <UsersIcon className="w-5 h-5" />
                            <span className="font-bold text-lg text-primary">{submissionCount}</span>
                        </div>
                    </Tooltip>
                    <button 
                        onClick={onViewSubmissions}
                        className="px-4 py-2 font-bold bg-accent text-primary rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent focus:outline-none focus:ring-4 focus:ring-accent/50"
                    >
                        View Submissions
                    </button>
                </div>
             </div>
        </div>
    );
};

export default MyQuestCard;