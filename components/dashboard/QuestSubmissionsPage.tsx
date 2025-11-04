import React, { useState, useMemo } from 'react';
import { Quest } from './QuestCard';
import { submissionsData } from './MyQuestsPage';
import { LinkIcon, TrophyIcon, UsersIcon, GiftIcon } from '../icons';
import ConfirmationModal from './ConfirmationModal';
import { ToastType } from '../../hooks/useToast';
import Tooltip from '../Tooltip';

const allQuestsData: Quest[] = [
  { id: 1, title: "Master the Sui SDK", difficulty: "Hard", category: "Development", participants: 12, nftBadge: { name: "Sui Sovereign", image: "https://picsum.photos/seed/nft1/64", points: 500 }, creator: '@DevWizard', status: 'Live', winner: null },
  { id: 2, title: "Create a Viral Meme", difficulty: "Easy", category: "Community", participants: 88, nftBadge: { name: "Meme Maestro", image: "https://picsum.photos/seed/nft2/64", points: 50 }, creator: '@MemeLord', status: 'Live', winner: null },
  { id: 3, title: "Design a Legendary NFT", difficulty: "Medium", category: "Art", participants: 34, nftBadge: { name: "Pixel Paladin", image: "https://picsum.photos/seed/nft3/64", points: 250 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: 4, title: "Write a Sui Tutorial", difficulty: "Medium", category: "Content", participants: 21, nftBadge: { name: "Scroll Scribe", image: "https://picsum.photos/seed/nft4/64", points: 200 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: 5, title: "Build a DeFi dApp", difficulty: "Hard", category: "Development", participants: 5, nftBadge: { name: "DeFi Demigod", image: "https://picsum.photos/seed/nft5/64", points: 1000 }, creator: '@DevWizard', status: 'Live', winner: null },
  { id: 6, title: "Host a Community Workshop", difficulty: "Medium", category: "Community", participants: 45, nftBadge: { name: "Community Sage", image: "https://picsum.photos/seed/nft6/64", points: 300 }, creator: '@CyberGlory', status: 'Live', winner: null },
];

interface QuestSubmissionsPageProps {
    questId: number;
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
    addToast: (message: string, type?: ToastType) => void;
}

interface Submission {
    user: string;
    avatar: string;
    link: string;
}

const QuestSubmissionsPage: React.FC<QuestSubmissionsPageProps> = ({ questId, onNavigate, addToast }) => {
    const quest = useMemo(() => allQuestsData.find(q => q.id === questId) || allQuestsData[0], [questId]);
    const submissions = useMemo(() => submissionsData[questId] || [], [questId]);

    const [winner, setWinner] = useState<Submission | null>(null);
    const [isConfirming, setIsConfirming] = useState<Submission | null>(null);
    const [isGifting, setIsGifting] = useState(false);

    const handleSelectWinner = (submission: Submission) => {
        setIsConfirming(submission);
    };

    const handleConfirmWinner = () => {
        if (isConfirming) {
            setWinner(isConfirming);
            addToast(`@${isConfirming.user} has been selected as the winner!`);
            setIsConfirming(null);
        }
    };
    
    const handleGiftNFT = () => {
        setIsGifting(true);
        setTimeout(() => {
            addToast(`NFT has been gifted to ${winner?.user}!`);
            setIsGifting(false);
        }, 1500); // Simulate API call
    }

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                 <button onClick={() => onNavigate('My Quests')} className="text-sm font-semibold text-accent hover:underline mb-4">
                    &larr; Back to My Quests
                </button>
                <h1 className="text-4xl font-bold font-heading text-primary">{quest.title}</h1>
                <p className="mt-2 text-secondary max-w-2xl">Review all submissions and select a winner to receive the reward.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submissions List */}
                <div className="lg:col-span-2 space-y-4 opacity-0 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>
                     <h2 className="text-2xl font-bold font-heading text-primary">Submissions ({submissions.length})</h2>
                     {submissions.length > 0 ? submissions.map((sub, index) => (
                        <div 
                            key={sub.user} 
                            className={`bg-surface border rounded-lg p-4 flex items-center justify-between transition-all duration-300 ${winner?.user === sub.user ? 'border-amber-400/50 ring-2 ring-amber-400/20' : 'border-border'}`}
                        >
                            <div className="flex items-center gap-4">
                                <img src={sub.avatar} alt={sub.user} className="w-12 h-12 rounded-full ring-2 ring-surface" />
                                <div>
                                    <p className="font-bold text-primary">{sub.user}</p>
                                    <a href={sub.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3"/> View Submission
                                    </a>
                                </div>
                            </div>
                            
                            {!winner && (
                                <button
                                    onClick={() => handleSelectWinner(sub)}
                                    className="px-4 py-2 font-bold bg-accent text-primary rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent focus:outline-none focus:ring-4 focus:ring-accent/50"
                                >
                                    Select as Winner
                                </button>
                            )}
                            {winner && winner.user === sub.user && (
                                <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <TrophyIcon className="w-5 h-5" />
                                    <span>Winner</span>
                                </div>
                            )}
                        </div>
                     )) : (
                         <div className="text-center py-16 px-6 bg-surface rounded-lg border border-border border-dashed">
                            <UsersIcon className="w-12 h-12 mx-auto text-secondary/30 mb-4" />
                            <h3 className="text-xl font-bold font-heading text-primary">No submissions yet.</h3>
                            <p className="text-secondary max-w-xs mx-auto mt-2">Check back later to see who has joined your quest.</p>
                        </div>
                     )}
                </div>

                 {/* Quest Info & Winner Panel */}
                <aside className="lg:sticky top-28 h-fit opacity-0 animate-slide-in-fade" style={{ animationDelay: '300ms' }}>
                     <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <h3 className="text-xl font-bold font-heading text-primary border-b border-border pb-3">Quest Reward</h3>
                        <div className="flex justify-between items-center bg-background p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img src={quest.nftBadge.image} alt={quest.nftBadge.name} className="w-12 h-12 rounded-md object-cover border-2 border-accent/30" />
                                <div>
                                    <p className="font-bold text-accent">{quest.nftBadge.name}</p>
                                    <p className="text-xs text-secondary">{quest.nftBadge.points} Points</p>
                                </div>
                            </div>
                        </div>

                         {winner && (
                             <div className="!mt-6 pt-4 border-t border-border">
                                <h3 className="text-xl font-bold font-heading text-primary mb-3">Selected Winner</h3>
                                <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                                    <img src={winner.avatar} alt={winner.user} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-bold text-primary">{winner.user}</p>
                                        <p className="text-xs text-secondary">Congratulations!</p>
                                    </div>
                                </div>
                                <Tooltip content="This action would trigger an on-chain transaction to transfer the NFT.">
                                    <button 
                                        onClick={handleGiftNFT}
                                        disabled={isGifting}
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 font-bold bg-green-500/20 text-green-300 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:bg-green-500/30 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        <GiftIcon className="w-5 h-5" />
                                        {isGifting ? 'Gifting NFT...' : 'Gift NFT Reward'}
                                    </button>
                                </Tooltip>
                             </div>
                         )}
                    </div>
                </aside>
            </div>

            {isConfirming && (
                <ConfirmationModal
                    isOpen={!!isConfirming}
                    onClose={() => setIsConfirming(null)}
                    onConfirm={handleConfirmWinner}
                    title="Select Winner"
                    message={`Are you sure you want to select ${isConfirming.user} as the winner for "${quest.title}"? This action cannot be undone.`}
                    confirmText="Confirm Winner"
                />
            )}
        </div>
    );
};

export default QuestSubmissionsPage;