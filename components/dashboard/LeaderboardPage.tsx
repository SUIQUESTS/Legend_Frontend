import React from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import { CrownIcon } from '../icons';

const leaderboardData = [
    { rank: 1, user: "@CyberGlory", quests: 42, score: 9850, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=CyberGlory" },
    { rank: 2, user: "@SuiSeeker", quests: 38, score: 9200, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=SuiSeeker" },
    { rank: 3, user: "@ChainChampion", quests: 35, score: 8750, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=ChainChampion" },
    { rank: 4, user: "@QuestKing", quests: 33, score: 8100, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=QuestKing" },
    { rank: 5, user: "@CodeCrusader", quests: 31, score: 7950, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=CodeCrusader" },
    { rank: 6, user: "@Artisan", quests: 28, score: 7500, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=Artisan" },
    { rank: 7, user: "@NFThinker", quests: 25, score: 7100, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=NFThinker" },
    { rank: 8, user: "@MemeLord", quests: 22, score: 6800, avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=MemeLord" },
];

const LeaderboardRow: React.FC<{ data: typeof leaderboardData[0]; index: number; isVisible: boolean }> = ({ data, index, isVisible }) => {
    
    const rankStyles: { [key: number]: string } = {
        1: "bg-accent/20 text-accent border-l-4 border-accent",
        2: "bg-primary/10 text-primary border-l-4 border-primary/50",
        3: "bg-secondary/10 text-secondary border-l-4 border-secondary/50",
    };

    const isTop3 = data.rank <= 3;

    return (
        <tr
            className={`border-b border-border group transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${isTop3 ? rankStyles[data.rank] : 'hover:bg-surface'}`}
            style={{ transform: isVisible ? 'none' : 'translateX(30px)', transitionDelay: `${index * 80}ms` }}
        >
            <td className="p-4 text-center font-bold font-heading text-lg">
                 {isTop3 ? <CrownIcon className={`w-6 h-6 mx-auto ${data.rank === 1 ? 'text-accent' : 'text-current'}`} /> : data.rank}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <img src={data.avatar} alt={data.user} className="w-10 h-10 rounded-full object-cover ring-2 ring-surface group-hover:ring-accent transition-all" />
                    <span className="font-semibold text-primary">{data.user}</span>
                </div>
            </td>
            <td className="p-4 text-center text-secondary group-hover:text-primary transition-colors">{data.quests}</td>
            <td className="p-4 text-center font-bold font-heading text-lg text-accent">{data.score.toLocaleString()}</td>
        </tr>
    );
};


const LeaderboardPage: React.FC = () => {
    const [tableRef, isTableVisible] = useOnScreen<HTMLTableSectionElement>({ threshold: 0.1, triggerOnce: true });

    return (
        <div style={{ fontFamily: "helvetica" }} className="p-8 space-y-10 animate-content-fade-in">
             <header>
                <h1 className="text-4xl font-bold font-heading text-primary">Leaderboard</h1>
                <p className="mt-2 text-secondary max-w-2xl">See where you stand among the legends. Climb the ranks by completing quests and earning points.</p>
            </header>

            <section>
                 <div className="bg-surface backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="border-b-2 border-border bg-background/30">
                            <tr>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center w-[10%]">Rank</th>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider w-[50%]">User</th>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Quests</th>
                                <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Score</th>
                            </tr>
                        </thead>
                        <tbody ref={tableRef}>
                            {leaderboardData.map((row, index) => (
                                <LeaderboardRow key={row.rank} data={row} index={index} isVisible={isTableVisible} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default LeaderboardPage;