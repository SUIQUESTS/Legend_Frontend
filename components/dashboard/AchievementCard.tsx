import React from 'react';

interface Achievement {
    id: number;
    title: string;
    description: string;
    image: string;
    dateEarned: string;
}

interface AchievementCardProps {
    achievement: Achievement;
    index: number;
    isVisible: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index, isVisible }) => {
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -1 * ((y - rect.height / 2) / (rect.height / 2)) * 8;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative aspect-square bg-surface border border-border rounded-xl shadow-lg transition-all duration-500 ease-out group overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{
                transitionProperty: 'opacity, transform',
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_350px_at_var(--x)_var(--y),_rgba(56,123,255,0.15),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
            
            <img src={achievement.image} alt={achievement.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent group-hover:from-background/90 group-hover:via-background/70 transition-colors duration-300"></div>
            
            <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                <div className="transform-gpu transition-transform duration-300 ease-in-out group-hover:-translate-y-2">
                     <h3 className="text-lg font-bold font-heading text-primary leading-tight line-clamp-2">{achievement.title}</h3>
                </div>
               
                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <p className="text-secondary text-xs mt-2 line-clamp-3">
                        {achievement.description}
                    </p>
                    <p className="text-xs text-accent font-mono mt-2">
                        Earned: {achievement.dateEarned}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;