import React, { useState } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import StatCard from './StatCard';
// FIX: Imported the Quest type to ensure data conforms to the expected interface.
import QuestCard, { Quest } from './QuestCard';
import { TrophyIcon, CrownIcon, HammerIcon, SparklesIcon } from '../icons';
import QuestFilters from './QuestFilters';

// FIX: Updated quest data to match the Quest interface.
// Added 'creator', 'winner', and changed 'status' to valid values.
const questData: Quest[] = [
    { 
        id: 1, 
        title: "Deploy a Smart Contract", 
        category: "Development", 
        progress: 75, 
        status: "Live",
        difficulty: "Medium", 
        participants: 21,
        creator: "@DevWizard",
        winner: null,
        nftBadge: { name: "Code Weaver", image: "https://picsum.photos/seed/dashnft1/64", points: 200 }
    },
    { 
        id: 2, 
        title: "Design a Legendary NFT", 
        category: "Art", 
        progress: 40, 
        status: "Live",
        difficulty: "Hard",
        participants: 34,
        creator: "@CyberGlory",
        winner: null,
        nftBadge: { name: "Pixel Paladin", image: "https://picsum.photos/seed/nft3/64", points: 250 }
    },
    { 
        id: 3, 
        title: "Create a Viral Meme", 
        category: "Community", 
        progress: 0, 
        status: "Live",
        difficulty: "Easy",
        participants: 88,
        creator: "@MemeLord",
        winner: null,
        nftBadge: { name: "Meme Maestro", image: "https://picsum.photos/seed/nft2/64", points: 50 }
    },
    { 
        id: 4, 
        title: "Write a Sui Tutorial", 
        category: "Content", 
        progress: 0, 
        status: "Live",
        difficulty: "Medium",
        participants: 15,
        creator: "@CyberGlory",
        winner: null,
        nftBadge: { name: "Scroll Scribe", image: "https://picsum.photos/seed/nft4/64", points: 150 }
    },
];

const DashboardHome: React.FC = () => {
    const [statsRef, statsVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });
    const [activeQuestsRef, activeQuestsVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });
    const [recommendedRef, recommendedVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });
    
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDifficulty, setActiveDifficulty] = useState('All');

    const categories = ['All', ...Array.from(new Set(questData.map(q => q.category)))];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

    const filteredQuests = questData.filter(quest => {
        const categoryMatch = activeCategory === 'All' || quest.category === activeCategory;
        const difficultyMatch = activeDifficulty === 'All' || quest.difficulty === activeDifficulty;
        return categoryMatch && difficultyMatch;
    });

    // FIX: Filtering logic updated to use 'progress' to differentiate between
    // active and recommended quests, as 'status' is now 'Live' for both.
    const activeQuests = filteredQuests.filter(q => q.progress && q.progress > 0);
    const recommendedQuests = filteredQuests.filter(q => q.progress === 0);

    return (
        <div className="p-8 space-y-12 animate-content-fade-in">
            {/* Stats Section */}
            <section ref={statsRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<CrownIcon />} title="Current Rank" value="#1" index={0} isVisible={statsVisible} />
                    <StatCard icon={<TrophyIcon />} title="Total Points" value="9,850" index={1} isVisible={statsVisible} />
                    <StatCard icon={<HammerIcon />} title="Quests Done" value="42" index={2} isVisible={statsVisible} />
                    <StatCard icon={<SparklesIcon />} title="Achievements" value="12" index={3} isVisible={statsVisible} />
                </div>
            </section>
            
             {/* Filters */}
            <section style={{ fontFamily: "helvetica" }}>
                <QuestFilters
                    categories={categories}
                    difficulties={difficulties}
                    activeCategory={activeCategory}
                    activeDifficulty={activeDifficulty}
                    onCategoryChange={setActiveCategory}
                    onDifficultyChange={setActiveDifficulty}
                />
            </section>
            
            {/* Active Quests Section */}
            <section ref={activeQuestsRef}>
                 <h2 className="text-3xl font-bold font-heading text-primary mb-6">Your Active Quests</h2>
                 {activeQuests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeQuests.map((quest, index) => (
                            <QuestCard key={quest.id} quest={quest} index={index} isVisible={activeQuestsVisible} />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-10 px-6 bg-surface rounded-lg border border-border">
                        <p className="text-secondary">No active quests match your filters.</p>
                    </div>
                 )}
            </section>

             {/* Recommended Quests Section */}
            <section ref={recommendedRef}>
                 <h2 className="text-3xl font-bold font-heading text-primary mb-6">Recommended For You</h2>
                 {recommendedQuests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedQuests.map((quest, index) => (
                            <QuestCard key={quest.id} quest={quest} index={index} isVisible={recommendedVisible} />
                        ))}
                    </div>
                 ) : (
                     <div className="text-center py-10 px-6 bg-surface rounded-lg border border-border">
                        <p className="text-secondary">No recommended quests match your filters.</p>
                    </div>
                 )}
            </section>
        </div>
    );
};

export default DashboardHome;