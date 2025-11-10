import React, { useState, useMemo, useEffect } from 'react';
import { Quest } from './QuestCard';
import { LinkIcon, TrophyIcon, UsersIcon, GiftIcon } from '../icons';
import ConfirmationModal from './ConfirmationModal';
import { ToastType } from '../../hooks/useToast';
import Tooltip from '../Tooltip';
import axios from 'axios';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { NFT } from './NFTSelector';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const provider = new SuiClient({ url: getFullnodeUrl('testnet') });



interface ApiSubmission {
    _id: string;
    challenge: string;
    participant_address: string;
    submission_link: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiQuest {
    _id: string;
    creator: string;
    title: string;
    description: string;
    participant_limit: number | null;
    participantLimit: number | null;
    deadline: string;
    nft_id: string;
    status: 'active' | 'completed' | 'judging';
    submissions: ApiSubmission[];
    winner: string | null;
    dateCreated: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface QuestSubmissionsPageProps {
    questId: string;
    questTitle?: string;
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
    addToast: (message: string, type?: ToastType) => void;
}

const QuestSubmissionsPage: React.FC<QuestSubmissionsPageProps> = ({ questId, questTitle, onNavigate, addToast }) => {
    const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quest, setQuest] = useState<ApiQuest | null>(null);
    const [winner, setWinner] = useState<ApiSubmission | null>(null);
    const [isConfirming, setIsConfirming] = useState<ApiSubmission | null>(null);
    const [isSelectingWinner, setIsSelectingWinner] = useState(false);
    const currentAccount = useCurrentAccount();
    const [nfts, setNfts] = useState<NFT[]>([]);
    const owner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";



        useEffect(() => {
            async function getAllNFTs() {
                const packageId = "0xedf2c6c215b787828e9a05b0d07b9b2309fe573d23e0812ab1ceb489debc5742";
                try {
                    const objects = await provider.getOwnedObjects({
                        owner: owner,
                        options: {
                            showType: true,
                            showContent: true,
                        },
                    });
            
                    const transformedNfts = objects.data
                        .filter((object) => object.data?.type?.includes(`${packageId}::nft::NFT`))
                        .map((object) => {
                            if (object.data?.content && 'fields' in object.data.content) {
                                const fields = (object.data.content as any).fields;
                                return {
                                    id: object.data.objectId,
                                    name: fields?.title || 'Unnamed NFT',
                                    image: fields?.image || '',
                                    points: parseInt(fields?.points || '0')
                                };
                            }
                            return null;
                        })
                        .filter((nft): nft is NFT => nft !== null && nft.image && nft.name);
            
                    setNfts(transformedNfts.filter((nft, index) => index !== 3));
                } catch (error) {
                    console.error("Error fetching NFTs:", error);
                }
            }
            
            getAllNFTs();
        }, [owner]);

    // Fetch quest details and submissions
    useEffect(() => {
        async function fetchQuestAndSubmissions() {
            if (!currentAccount?.address) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                console.log("Fetching quest and submissions for questId:", questId);
                
                // Fetch user's created quests to get the specific quest
                const response = await axios.get(
                    `https://legendbackend-a29sm.sevalla.app/api/challenges/creator/${currentAccount.address}`
                );

                console.log("User quests response:", response.data);

                if (response.data && response.data.active) {
                    // Find the specific quest by ID
                    const foundQuest = response.data.active.find((q: ApiQuest) => q._id === questId);
                    
                    if (foundQuest) {
                        setQuest(foundQuest);
                        
                        // Set submissions from the quest data
                        if (foundQuest.submissions && Array.isArray(foundQuest.submissions)) {
                            console.log("Submissions found:", foundQuest.submissions);
                            setSubmissions(foundQuest.submissions);
                        } else {
                            console.log("No submissions found");
                            setSubmissions([]);
                        }

                        // If quest already has a winner, set it
                        if (foundQuest.winner) {
                            const winnerSubmission = foundQuest.submissions.find(
                                (sub: ApiSubmission) => sub.participant_address === foundQuest.winner
                            );
                            if (winnerSubmission) {
                                setWinner(winnerSubmission);
                            }
                        }
                    } else {
                        console.error("Quest not found in user's quests");
                        addToast('Quest not found', 'error');
                    }
                } else {
                    console.error("No challenges found in response");
                    addToast('No quests found', 'error');
                }
            } catch (error) {
                console.error("Error fetching quest and submissions:", error);
                addToast('Failed to load quest data', 'error');
            } finally {
                setIsLoading(false);
            }
        }

        if (questId && currentAccount?.address) {
            fetchQuestAndSubmissions();
        }
    }, [questId, currentAccount?.address, addToast]);

    // Transform API quest to Quest format for display
    const transformedQuest: Quest | null = useMemo(() => {
        if (!quest) return null;

        return {
            id: quest._id,
            title: quest.title,
            description: quest.description,
            category: quest.title.toLowerCase().includes('meme') ? 'Community' : 
                     quest.title.toLowerCase().includes('design') ? 'Art' : 
                     quest.title.toLowerCase().includes('tutorial') ? 'Content' : 'Development',
            difficulty: 'Medium',
            participants: quest.submissions?.length || 0,
            creator: `@${quest.creator.slice(0, 8)}...`,
            status: quest.status === 'completed' ? 'Completed' : 
                   quest.status === 'judging' ? 'Judging' : 'Live',
            winner: quest.winner,
            nftBadge: {
                name: 'Quest Badge',
                image: 'https://picsum.photos/seed/nft/64',
                points: 100
            }
        };
    }, [quest]);

    // Generate avatar URL based on participant address
    const generateAvatarUrl = (address: string) => {
        return `https://api.dicebear.com/8.x/bottts/svg?seed=${address}`;
    };

    // Format participant address for display
    const formatParticipant = (address: string) => {
        return `@${address.slice(0, 8)}...`;
    };

    const handleSelectWinner = (submission: ApiSubmission) => {
        setIsConfirming(submission);
    };

    const handleConfirmWinner = async () => {
        if (isConfirming && quest) {
            try {
                setWinner(isConfirming);
                addToast(`${formatParticipant(isConfirming.participant_address)} has been selected as the winner!`);
            } catch (error) {
                console.error("Error setting winner:", error);
                addToast('Failed to set winner', 'error');
            } finally {
                setIsConfirming(null);
            }
        }
    };

    // Select winner and complete quest via API
    const selectWinnerAndCompleteQuest = async (): Promise<boolean> => {
        if (!winner || !quest) return false;

        const matchingNft = nfts.find(nft => nft.id === quest.nft_id);
        console.log("Matching NFT for quest:", matchingNft);
        try {
            const payload = {
                challengeId: quest._id,
                winnerAddress: winner.participant_address,
                nftDetails: {
                    nft_id: quest.nft_id,
                    title: matchingNft.name,
                    image: matchingNft.image,
                    points: matchingNft.points
                }
            };

            console.log("Sending select-winner payload:", payload);

            const response = await axios.put(
                'https://legendbackend-a29sm.sevalla.app/api/challenges/select-winner',
                payload
            );

            if (response.status === 200) {
                addToast('Winner selected and NFT awarded successfully!', 'success');
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Error selecting winner:', error);
            const errorMessage = error.response?.data?.message || 'Failed to select winner and complete quest';
            addToast(errorMessage, 'error');
            return false;
        }
    };

    const handleSelectWinnerAndComplete = async () => {
        if (!winner || !quest) return;
        
        setIsSelectingWinner(true);
        try {
            const success = await selectWinnerAndCompleteQuest();
            
            if (success) {
                // Navigate back to My Quests after a short delay
                setTimeout(() => {
                    onNavigate('My Quests');
                }, 1500);
            }
        } catch (error) {
            console.error("Error in winner selection process:", error);
            addToast('Failed to complete winner selection process', 'error');
        } finally {
            setIsSelectingWinner(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-secondary">Loading submissions...</p>
                </div>
            </div>
        );
    }

    if (!quest || !transformedQuest) {
        return (
            <div className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
                <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                    <UsersIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                    <h3 className="text-2xl font-bold font-heading text-primary">Quest Not Found</h3>
                    <p className="text-secondary max-w-xs mx-auto mt-2">The requested quest could not be found.</p>
                    <button 
                        onClick={() => onNavigate('My Quests')}
                        className="mt-6 group relative font-semibold text-primary px-6 py-2 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent"
                    >
                        Back to My Quests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                 <button onClick={() => onNavigate('My Quests')} className="text-sm font-semibold text-accent hover:underline mb-4">
                    &larr; Back to My Quests
                </button>
                <h1 className="text-4xl font-bold font-heading text-primary">{transformedQuest.title}</h1>
                <p className="mt-2 text-secondary max-w-2xl">{transformedQuest.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-secondary">
                    <span>Status: <span className="font-semibold text-primary">{transformedQuest.status}</span></span>
                    <span>•</span>
                    <span>Deadline: <span className="font-semibold text-primary">
                        {new Date(quest.deadline).toLocaleDateString()}
                    </span></span>
                    <span>•</span>
                    <span>Participants: <span className="font-semibold text-primary">{submissions.length}</span></span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submissions List */}
                <div className="lg:col-span-2 space-y-4 opacity-0 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>
                     <h2 className="text-2xl font-bold font-heading text-primary">Submissions ({submissions.length})</h2>
                     {submissions.length > 0 ? submissions.map((sub, index) => (
                        <div 
                            key={sub._id} 
                            className={`bg-surface border rounded-lg p-4 flex items-center justify-between transition-all duration-300 ${winner?._id === sub._id ? 'border-amber-400/50 ring-2 ring-amber-400/20' : 'border-border'}`}
                        >
                            <div className="flex items-center gap-4">
                                <img 
                                    src={generateAvatarUrl(sub.participant_address)} 
                                    alt={sub.participant_address} 
                                    className="w-12 h-12 rounded-full ring-2 ring-surface" 
                                />
                                <div>
                                    <p className="font-bold text-primary">{formatParticipant(sub.participant_address)}</p>
                                    <a 
                                        href={sub.submission_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-accent hover:underline flex items-center gap-1"
                                    >
                                        <LinkIcon className="w-3 h-3"/> View Submission
                                    </a>
                                    <p className="text-xs text-secondary mt-1">
                                        Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                                    </p>
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
                            {winner && winner._id === sub._id && (
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
                        <h3 className="text-xl font-bold font-heading text-primary border-b border-border pb-3">Quest Details</h3>
                        
                        <div>
                            <p className="text-sm text-secondary">NFT Reward</p>
                            <p className="font-bold text-primary">Badge: {quest.nft_id.slice(0, 8)}...</p>
                        </div>

                        <div>
                            <p className="text-sm text-secondary">Participant Limit</p>
                            <p className="font-bold text-primary">
                                {quest.participant_limit || quest.participantLimit || 'No limit'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-secondary">Created</p>
                            <p className="font-bold text-primary">
                                {new Date(quest.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                         {winner && (
                             <div className="!mt-6 pt-4 border-t border-border">
                                <h3 className="text-xl font-bold font-heading text-primary mb-3">Selected Winner</h3>
                                <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                                    <img 
                                        src={generateAvatarUrl(winner.participant_address)} 
                                        alt={winner.participant_address} 
                                        className="w-12 h-12 rounded-full" 
                                    />
                                    <div>
                                        <p className="font-bold text-primary">{formatParticipant(winner.participant_address)}</p>
                                        <p className="text-xs text-secondary">Congratulations!</p>
                                    </div>
                                </div>
                                <Tooltip content="This will select the winner and award the NFT through the backend system.">
                                    <button 
                                        onClick={handleSelectWinnerAndComplete}
                                        disabled={isSelectingWinner}
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 font-bold bg-green-500/20 text-green-300 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 hover:bg-green-500/30 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        <GiftIcon className="w-5 h-5" />
                                        {isSelectingWinner ? 'Selecting Winner...' : 'Select Winner & Award NFT'}
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
                    message={`Are you sure you want to select ${formatParticipant(isConfirming.participant_address)} as the winner for "${transformedQuest.title}"? This action cannot be undone.`}
                    confirmText="Confirm Winner"
                />
            )}
        </div>
    );
};

export default QuestSubmissionsPage;