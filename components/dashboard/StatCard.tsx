import React from 'react';
import Tooltip from '../Tooltip';

interface StatCardProps {
    // Fix: Specify SVG props for the icon to allow cloning with className.
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: string;
    index: number;
    isVisible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, index, isVisible }) => {
    const tooltips: { [key: string]: string } = {
        "Current Rank": "Your position on the global leaderboard.",
        "Total Points": "Points earned from all completed quests.",
        "Quests Done": "The total number of quests you have completed.",
        "Achievements": "Special badges earned for milestone accomplishments.",
    };

    return (
        <div 
            className={`bg-surface backdrop-blur-md border border-border rounded-xl p-6 transition-all duration-500 ease-out group relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
        >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_farthest-corner_at_100%_0%,_rgba(56,123,255,0.1),_transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p style={{ fontFamily: "helvetica" }} className="text-secondary mb-2">{title}</p>
                    <p className={`text-4xl font-bold font-heading text-primary`}>{value}</p>
                </div>
                <Tooltip content={tooltips[title] || title}>
                    <div className={`w-12 h-12 flex items-center justify-center bg-background rounded-lg border border-border text-secondary group-hover:text-accent group-hover:border-accent/30 transition-all duration-300`}>
                        {React.cloneElement(icon, { className: 'w-7 h-7' })}
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};

export default StatCard;
