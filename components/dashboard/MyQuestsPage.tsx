import React from 'react';
import MyQuestCard from './MyQuestCard';
import { Quest } from './QuestCard';
import { PlusCircleIcon } from '../icons';

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

// Mock submissions data
export const submissionsData: { [key: number]: { user: string; avatar: string; link: string }[] } = {
    3: [
        { user: '@SuiSeeker', avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=SuiSeeker', link: 'https://www.artstation.com/artwork/pixel-paladin' },
        { user: '@Artisan', avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=Artisan', link: 'https://www.behance.net/gallery/12345/legendary-nft' },
    ],
    4: [
        { user: '@CodeCrusader', avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=CodeCrusader', link: 'https://dev.to/sui-tutorial' },
    ],
    6: [
        { user: '@ChainChampion', avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=ChainChampion', link: 'https://youtube.com/live/workshop-recording' },
        { user: '@QuestKing', avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=QuestKing', link: 'https://github.com/quest-king/workshop-slides' },
        { user: '@NFThinker', avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=NFThinker', link: 'https://docs.google.com/presentation/d/workshop' },
    ],
};


interface MyQuestsPageProps {
    username: string;
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
}

const MyQuestsPage: React.FC<MyQuestsPageProps> = ({ username, onNavigate }) => {
    // Note: The username from props might start with '@'. The mock data creator also has '@'.
    // Ensure consistent matching.
    const currentUser = `@${username}`; 
    const myQuests = allQuestsData.filter(q => q.creator === currentUser);

    return (
        <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                <h1 className="text-4xl font-bold font-heading text-primary">My Quests</h1>
                <p className="mt-2 text-secondary max-w-2xl">Manage your created quests, view submissions, and select the winners.</p>
            </header>

            <section className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>
                {myQuests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myQuests.map((quest, index) => (
                           <MyQuestCard 
                                key={quest.id} 
                                quest={quest}
                                submissionCount={submissionsData[quest.id]?.length || 0}
                                index={index}
                                onViewSubmissions={() => onNavigate('Submissions', { questId: quest.id })}
                           />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                        <PlusCircleIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                        <h3 className="text-2xl font-bold font-heading text-primary">You haven't created any quests yet.</h3>
                        <p className="text-secondary max-w-xs mx-auto mt-2">Go to the "Create Quest" page to launch your first challenge for the community!</p>
                        <button 
                            onClick={() => onNavigate('Create Quest')}
                            className="mt-6 group relative font-semibold text-primary px-6 py-2 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent"
                        >
                            Create a Quest
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyQuestsPage;