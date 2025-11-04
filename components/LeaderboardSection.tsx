import React from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { CrownIcon } from './icons';

const leaderboardData = [
    { rank: 1, user: "@CyberGlory", quests: 42, score: 9850, avatar: "https://picsum.photos/seed/lead1/40" },
    { rank: 2, user: "@SuiSeeker", quests: 38, score: 9200, avatar: "https://picsum.photos/seed/lead2/40" },
    { rank: 3, user: "@ChainChampion", quests: 35, score: 8750, avatar: "https://picsum.photos/seed/lead3/40" },
    { rank: 4, user: "@QuestKing", quests: 33, score: 8100, avatar: "https://picsum.photos/seed/lead4/40" },
    { rank: 5, user: "@CodeCrusader", quests: 31, score: 7950, avatar: "https://picsum.photos/seed/lead5/40" },
    { rank: 6, user: "@Artisan", quests: 28, score: 7500, avatar: "https://picsum.photos/seed/lead6/40" },
];

const LeaderboardRow: React.FC<{ data: typeof leaderboardData[0]; index: number }> = ({ data, index }) => {
    const [ref, isVisible] = useOnScreen<HTMLTableRowElement>({ threshold: 0.2, triggerOnce: true });
    
    const rankStyles: { [key: number]: string } = {
        1: "bg-amber-400/10 text-amber-300 border-l-4 border-amber-400",
        2: "bg-slate-300/10 text-slate-200 border-l-4 border-slate-300",
        3: "bg-orange-400/10 text-orange-300 border-l-4 border-orange-400",
    };

    const isTop3 = data.rank <= 3;

    return (
        <tr
            ref={ref}
            className={`border-b border-border group transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${isTop3 ? rankStyles[data.rank] : 'hover:bg-surface'}`}
            style={{ transform: isVisible ? 'none' : 'translateX(30px)', transitionDelay: `${index * 80}ms` }}
        >
            <td className="p-4 text-center font-bold font-heading text-lg">
                 {isTop3 ? <CrownIcon className="w-6 h-6 mx-auto" /> : data.rank}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <img src={data.avatar} alt={data.user} className="w-10 h-10 rounded-full object-cover ring-2 ring-surface group-hover:ring-accent transition-all" />
                    <span className="font-semibold text-primary">{data.user}</span>
                </div>
            </td>
            <td className="p-4 text-center text-secondary group-hover:text-primary transition-colors">{data.quests}</td>
            <td className="p-4 text-center font-bold font-heading text-lg text-accent-soft">{data.score.toLocaleString()}</td>
        </tr>
    );
};

const LeaderboardSection: React.FC = () => {
    const [titleRef, isTitleVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });

    return (
        <section id="leaderboard" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-6">
                <div 
                    ref={titleRef} 
                    className={`text-center mb-16 transition-all duration-700 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary uppercase">Top Champions</h2>
                    <p style={{  fontFamily: "helvetica" }} className="mt-4 text-lg text-secondary max-w-2xl mx-auto">The mightiest legends leading the charge. Will you join them?</p>
                </div>
                <div style={{  fontFamily: "helvetica" }} className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="border-b-2 border-border">
                            <tr>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center w-1/6">Rank</th>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider w-1/2">User</th>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Quests</th>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((row, index) => (
                                <LeaderboardRow key={row.rank} data={row} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default LeaderboardSection;