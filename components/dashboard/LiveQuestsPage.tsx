import React, { useState, useMemo } from 'react';
import QuestCard, { Quest } from './QuestCard';
import QuestFilters from './QuestFilters';
import JoinQuestModal from './JoinQuestModal';
import { SearchIcon, LayoutGridIcon } from '../icons';
import { ToastType } from '../../hooks/useToast';

const allQuestsData: Quest[] = [
  { id: 1, title: "Master the Sui SDK", difficulty: "Hard", category: "Development", participants: 12, nftBadge: { name: "Sui Sovereign", image: "https://picsum.photos/seed/nft1/64", points: 500 }, creator: '@DevWizard', status: 'Live', winner: null },
  { id: 2, title: "Create a Viral Meme", difficulty: "Easy", category: "Community", participants: 88, nftBadge: { name: "Meme Maestro", image: "https://picsum.photos/seed/nft2/64", points: 50 }, creator: '@MemeLord', status: 'Live', winner: null },
  { id: 3, title: "Design a Legendary NFT", difficulty: "Medium", category: "Art", participants: 34, nftBadge: { name: "Pixel Paladin", image: "https://picsum.photos/seed/nft3/64", points: 250 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: 4, title: "Write a Sui Tutorial", difficulty: "Medium", category: "Content", participants: 21, nftBadge: { name: "Scroll Scribe", image: "https://picsum.photos/seed/nft4/64", points: 200 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: 5, title: "Build a DeFi dApp", difficulty: "Hard", category: "Development", participants: 5, nftBadge: { name: "DeFi Demigod", image: "https://picsum.photos/seed/nft5/64", points: 1000 }, creator: '@DevWizard', status: 'Live', winner: null },
  { id: 6, title: "Host a Community Workshop", difficulty: "Medium", category: "Community", participants: 45, nftBadge: { name: "Community Sage", image: "https://picsum.photos/seed/nft6/64", points: 300 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: 7, title: "Pixel Art Sprite Contest", difficulty: "Easy", category: "Art", participants: 150, nftBadge: { name: "Sprite Sorcerer", image: "https://picsum.photos/seed/nft7/64", points: 75 }, creator: '@Artisan', status: 'Completed', winner: '@SuiSeeker' },
  { id: 8, title: "Translate Documentation", difficulty: "Easy", category: "Content", participants: 30, nftBadge: { name: "Lingua Legend", image: "https://picsum.photos/seed/nft8/64", points: 100 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: 9, title: "Smart Contract Audit Challenge", difficulty: "Hard", category: "Development", participants: 8, nftBadge: { name: "Code Guardian", image: "https://picsum.photos/seed/nft9/64", points: 1200 }, creator: '@DevWizard', status: 'Judging', winner: null },
  { id: 10, title: "Create a 'Why Sui?' Video", difficulty: "Medium", category: "Content", participants: 25, nftBadge: { name: "Sui Evangelist", image: "https://picsum.photos/seed/nft10/64", points: 220 }, creator: '@MemeLord', status: 'Live', winner: null },
  { id: 11, title: "On-chain Generative Art", difficulty: "Hard", category: "Art", participants: 15, nftBadge: { name: "Chain Artist", image: "https://picsum.photos/seed/nft11/64", points: 800 }, creator: '@Artisan', status: 'Live', winner: null },
  { id: 12, title: "Organize a Twitter Space", difficulty: "Easy", category: "Community", participants: 60, nftBadge: { name: "Social Sovereign", image: "https://picsum.photos/seed/nft12/64", points: 90 }, creator: '@CyberGlory', status: 'Completed', winner: '@QuestKing' },
];

interface LiveQuestsPageProps {
    username: string;
    addToast: (message: string, type?: ToastType) => void;
}

const LiveQuestsPage: React.FC<LiveQuestsPageProps> = ({ username, addToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDifficulty, setActiveDifficulty] = useState('All');
    
    const [joiningQuest, setJoiningQuest] = useState<Quest | null>(null);
    const [joinedQuests, setJoinedQuests] = useState<Set<number>>(new Set());

    const categories = ['All', ...Array.from(new Set(allQuestsData.map(q => q.category)))];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

    const filteredQuests = useMemo(() => {
        return allQuestsData.filter(quest => {
            const term = searchTerm.toLowerCase();
            const searchMatch = quest.title.toLowerCase().includes(term) || quest.category.toLowerCase().includes(term);
            const categoryMatch = activeCategory === 'All' || quest.category === activeCategory;
            const difficultyMatch = activeDifficulty === 'All' || quest.difficulty === activeDifficulty;
            return searchMatch && categoryMatch && difficultyMatch;
        });
    }, [searchTerm, activeCategory, activeDifficulty]);

    const handleJoinQuest = (quest: Quest) => {
        setJoiningQuest(quest);
    };

    const handleCloseModal = () => {
        setJoiningQuest(null);
    };

    const handleSubmission = (questId: number, link: string) => {
        console.log(`Submitted to Quest ${questId}: ${link} by ${username}`);
        setJoinedQuests(prev => new Set(prev).add(questId));
        handleCloseModal();
        addToast(`Successfully submitted to "${joiningQuest?.title}"!`);
    };

    return (
        <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                <h1 className="text-4xl font-bold font-heading text-primary">Live Quests</h1>
                <p className="mt-2 text-secondary max-w-2xl">Browse all available challenges. Your next legend awaits.</p>
            </header>

            <div className="space-y-4 opacity-0 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by quest title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border-2 border-border focus:border-accent focus:ring-2 focus:ring-accent/50 rounded-lg pl-12 pr-4 py-3 transition-colors duration-300 focus:outline-none"
                    />
                </div>
                <QuestFilters
                    categories={categories}
                    difficulties={difficulties}
                    activeCategory={activeCategory}
                    activeDifficulty={activeDifficulty}
                    onCategoryChange={setActiveCategory}
                    onDifficultyChange={setActiveDifficulty}
                />
            </div>

            <section className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '300ms' }}>
                {filteredQuests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredQuests.map((quest, index) => (
                            <QuestCard
                                key={quest.id}
                                quest={quest}
                                index={index}
                                isVisible={true}
                                onJoin={handleJoinQuest}
                                participationStatus={joinedQuests.has(quest.id) ? 'joined' : 'not_joined'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                        <LayoutGridIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                        <h3 className="text-2xl font-bold font-heading text-primary">No Quests Found</h3>
                        <p className="text-secondary max-w-xs mx-auto mt-2">Try adjusting your search or filter settings to find what you're looking for.</p>
                    </div>
                )}
            </section>
            
            {joiningQuest && (
                <JoinQuestModal
                    quest={joiningQuest}
                    isOpen={!!joiningQuest}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmission}
                />
            )}
        </div>
    );
};

export default LiveQuestsPage;