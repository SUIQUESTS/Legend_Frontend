import React, { useState, useMemo, useEffect } from 'react';
import QuestCard, { Quest } from './QuestCard';
import QuestFilters from './QuestFilters';
import JoinQuestModal from './JoinQuestModal';
import { SearchIcon, LayoutGridIcon } from '../icons';
import { ToastType } from '../../hooks/useToast';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { NFT } from './NFTSelector';
import axios from 'axios';
import { useCurrentAccount } from '@mysten/dapp-kit';

const provider = new SuiClient({ url: getFullnodeUrl('testnet') });

interface ApiQuest {
  _id: string;
  title: string;
  description: string;
  creator: string;
  status: 'active' | 'completed' | 'judging';
  nft_id: string;
  participantLimit: number | null;
  submissions: string[];
  winner: string | null;
  deadline: string;
  dateCreated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LiveQuestsPageProps {
    username: string;
    addToast: (message: string, type?: ToastType) => void;
}

const LiveQuestsPage: React.FC<LiveQuestsPageProps> = ({ username, addToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDifficulty, setActiveDifficulty] = useState('All');
    
    const [joiningQuest, setJoiningQuest] = useState<Quest | null>(null);
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [quests, setQuests] = useState<ApiQuest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentAccount = useCurrentAccount();
    const [userSubmittedQuestIds, setUserSubmittedQuestIds] = useState<Set<string>>(new Set());
    const owner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";
    
    const getAllQuests = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get('https://legendbackend-a29sm.sevalla.app/api/challenges/getall');
            setQuests(data.filter((quest) => quest.creator !== currentAccount?.address && quest.status === 'active'));
        } catch (error) {
            console.error("Error fetching quests data:", error);
            addToast('Failed to load quests', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getAllNFTs = async () => {
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
            addToast('Failed to load NFTs', 'error');
        }
    };

    useEffect(() => {
        getAllNFTs();
        getAllQuests();
    }, [owner, addToast]);

    // Check if user has submitted to a quest (only local tracking since we can't verify from API)
    const hasUserSubmitted = (quest: ApiQuest): boolean => {
        return userSubmittedQuestIds.has(quest._id);
    };

    // Transform API quests to Quest format and filter out quests user has already submitted to
    const transformedQuests: Quest[] = useMemo(() => {
        return quests
            .filter(apiQuest => !hasUserSubmitted(apiQuest))
            .map((apiQuest, index) => {
                const matchingNft = nfts.find(nft => nft.id === apiQuest.nft_id);
                console.log('Matching NFT for quest', apiQuest.title, ':', nfts);

                let status: 'Live' | 'Judging' | 'Completed' = 'Live';
                if (apiQuest.status === 'completed') status = 'Completed';
                else if (apiQuest.status === 'judging') status = 'Judging';
                
                const category = apiQuest.title.toLowerCase().includes('meme') ? 'Community' : 
                               apiQuest.title.toLowerCase().includes('design') ? 'Art' : 
                               apiQuest.title.toLowerCase().includes('tutorial') ? 'Content' : 'Development';
                
                const difficulty = index % 3 === 0 ? 'Easy' : index % 3 === 1 ? 'Medium' : 'Hard';
                
                return {
                    id: apiQuest._id,
                    title: apiQuest.title,
                    description: apiQuest.description,
                    category: category,
                    difficulty: difficulty,
                    participants: apiQuest.submissions?.length || 0,
                    creator: `@${apiQuest.creator.slice(0, 8)}...`,
                    status: status,
                    winner: apiQuest.winner,
                    nftBadge: {
                        name: matchingNft?.name || 'Quest Badge',
                        image: matchingNft?.image || 'https://picsum.photos/seed/nft/64',
                        points: matchingNft?.points || 100
                    }
                };
            });
    }, [quests, nfts, userSubmittedQuestIds]);

    const categories = ['All', ...Array.from(new Set(transformedQuests.map(q => q.category)))];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

    const filteredQuests = useMemo(() => {
        return transformedQuests.filter(quest => {
            const term = searchTerm.toLowerCase();
            const searchMatch = quest.title.toLowerCase().includes(term) || 
                              quest.category.toLowerCase().includes(term) ||
                              (quest.description && quest.description.toLowerCase().includes(term));
            const categoryMatch = activeCategory === 'All' || quest.category === activeCategory;
            const difficultyMatch = activeDifficulty === 'All' || quest.difficulty === activeDifficulty;
            return searchMatch && categoryMatch && difficultyMatch;
        });
    }, [searchTerm, activeCategory, activeDifficulty, transformedQuests]);

    const handleJoinQuest = (quest: Quest) => {
        setJoiningQuest(quest);
    };

    const handleCloseModal = () => {
        setJoiningQuest(null);
    };

    const handleSubmission = async (questId: string, link: string) => {
        try {
            const participantAddress = currentAccount?.address;
            
            if (!participantAddress) {
                addToast('Please connect your wallet to submit', 'error');
                return;
            }

            const submissionData = {
                participant_address: participantAddress,
                submission_link: link
            };

            console.log('Submitting to quest:', questId, 'with data:', submissionData);

            const response = await axios.post(
                `https://legendbackend-a29sm.sevalla.app/api/challenges/${questId}/submit`,
                submissionData
            );

            console.log('Submission response:', response);

            if (response.status === 200 || response.status === 201) {
                // Add to locally tracked submissions
                setUserSubmittedQuestIds(prev => new Set(prev).add(questId));
                handleCloseModal();
                addToast(`Successfully submitted to "${joiningQuest?.title}"!`);
                
                // Refresh quests to get updated submission counts
                await getAllQuests();
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit to quest';
            addToast(errorMessage, 'error');
            // Re-throw the error so the modal can handle it
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-secondary">Loading quests...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                <h1 className="text-4xl font-bold font-heading text-primary">Available Quests</h1>
                <p className="mt-2 text-secondary max-w-2xl">
                    {currentAccount ? 
                        "Browse challenges you haven't submitted to yet. Your next legend awaits." :
                        "Connect your wallet to see available quests."
                    }
                </p>
            </header>

            {!currentAccount && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                    <p className="text-yellow-400">Please connect your wallet to view and participate in quests.</p>
                </div>
            )}

            {currentAccount && (
                <>
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
                                        participationStatus={'not_joined'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                                <LayoutGridIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                                <h3 className="text-2xl font-bold font-heading text-primary">
                                    {transformedQuests.length === 0 ? 
                                        "No Available Quests" : 
                                        "No Quests Found"
                                    }
                                </h3>
                                <p className="text-secondary max-w-xs mx-auto mt-2">
                                    {transformedQuests.length === 0 ? 
                                        "You've submitted to all available quests or there are no active quests." : 
                                        "Try adjusting your search or filter settings to find what you're looking for."
                                    }
                                </p>
                            </div>
                        )}
                    </section>
                </>
            )}
            
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