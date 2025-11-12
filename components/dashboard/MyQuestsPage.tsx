import React, { useEffect, useState } from 'react';
import MyQuestCard from './MyQuestCard';
import { Quest } from './QuestCard';
import { PlusCircleIcon } from '../icons';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { NFT } from './NFTSelector';
import axios from 'axios';
import { useCurrentAccount } from '@mysten/dapp-kit';

const provider = new SuiClient({ url: getFullnodeUrl('testnet') });

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
  submissions: Array<{
    _id: string;
    challenge: string;
    participant_address: string;
    submission_link: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }> | string[];
  winner: string | null;
  dateCreated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  message: string;
  creator: string;
  totalChallenges: number;
  currentPage: number;
  totalPages: number;
  active: ApiQuest[];
}

interface MyQuestsPageProps {
    username: string;
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
}

const MyQuestsPage: React.FC<MyQuestsPageProps> = ({ username, onNavigate }) => {
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentAccount = useCurrentAccount();
    const owner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";

    // Fetch NFTs
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

    // Fetch user's created quests - SEPARATED from NFTs dependency
    useEffect(() => {
        async function getUserQuests() {
            if (!currentAccount?.address) {
                // console.log("No wallet connected");
                setIsLoading(false);
                setQuests([]);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                console.log("Fetching quests for:", currentAccount.address);
                
                const response = await axios.get<ApiResponse>(
                    `https://legendbackend-a29sm.sevalla.app/api/challenges/creator/${currentAccount?.address}`
                );

                // console.log("API Response:", response.data);

                if (response.data && response.data.active && response.data.active.length > 0) {
                    // console.log(`Found ${response.data.active.length} challenges`);
                    
                    const transformedQuests: Quest[] = response.data.active.map((apiQuest, index) => {
                        // Find the matching NFT for this quest
                        const matchingNft = nfts.find(nft => nft.id === apiQuest.nft_id);
                        
                        // Determine status mapping
                        let status: 'Live' | 'Judging' | 'Completed' = 'Live';
                        if (apiQuest.status === 'completed') status = 'Completed';
                        else if (apiQuest.status === 'judging') status = 'Judging';
                        
                        // Simple category mapping based on title/content
                        const category = apiQuest.title.toLowerCase().includes('meme') ? 'Community' : 
                                       apiQuest.title.toLowerCase().includes('design') ? 'Art' : 
                                       apiQuest.title.toLowerCase().includes('tutorial') ? 'Content' : 'Development';
                        
                        // Simple difficulty mapping
                        const difficulty = index % 3 === 0 ? 'Easy' : index % 3 === 1 ? 'Medium' : 'Hard';
                        
                        // Calculate submission count - handle both array types
                        let submissionCount = 0;
                        if (Array.isArray(apiQuest.submissions)) {
                            submissionCount = apiQuest.submissions.length;
                        }

                        return {
                            id: apiQuest._id,
                            title: apiQuest.title,
                            description: apiQuest.description,
                            category: category,
                            difficulty: difficulty,
                            participants: submissionCount,
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

                    // console.log("Transformed quests:", transformedQuests);
                    // console.log("Current account address:", currentAccount.address.slice(0, 7));
                    setQuests(transformedQuests.filter(quest => quest.creator === `@${currentAccount.address.slice(0, 8)}...`));
                } else {
                    // console.log("No challenges found");
                    setQuests([]);
                }
            } catch (error: any) {
                // console.error("Error fetching user quests:", error);
                if (error.response) {
                    console.error("Error response:", error.response.status, error.response.data);
                }
                setError('Failed to load your quests. Please try again.');
                setQuests([]);
            } finally {
                setIsLoading(false);
            }
        }

        getUserQuests();
    }, [currentAccount?.address]); // Removed nfts dependency to avoid infinite loops

    // Debug current state
    useEffect(() => {
        console.log("Current state:", {
            isLoading,
            error,
            questsCount: quests.length,
            currentAccount: currentAccount?.address,
            nftsCount: nfts.length
        });
    }, [isLoading, error, quests, currentAccount, nfts]);

    if (isLoading) {
        return (
            <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-secondary">Loading your quests...</p>
                    {currentAccount && (
                        <p className="text-sm text-secondary mt-2">Fetching quests for {currentAccount.address.slice(0, 8)}...</p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
                <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                    <PlusCircleIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                    <h3 className="text-2xl font-bold font-heading text-primary">Error Loading Quests</h3>
                    <p className="text-secondary max-w-xs mx-auto mt-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 group relative font-semibold text-primary px-6 py-2 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!currentAccount) {
        return (
            <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
                <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                    <PlusCircleIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                    <h3 className="text-2xl font-bold font-heading text-primary">Connect Your Wallet</h3>
                    <p className="text-secondary max-w-xs mx-auto mt-2">Please connect your wallet to view the quests you've created.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-8 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                <h1 className="text-4xl font-bold font-heading text-primary">My Quests</h1>
                <p className="mt-2 text-secondary max-w-2xl">
                    Manage your created quests, view submissions, and select the winners.
                    {quests.length > 0 && ` (${quests.length} quests found)`}
                </p>
            </header>

            <section className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>
                {quests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {quests.map((quest, index) => (
                           <MyQuestCard 
                                key={quest.id} 
                                quest={quest}
                                submissionCount={quest.participants}
                                index={index}
                                onViewSubmissions={() => onNavigate('Submissions', { 
                                    questId: quest.id,
                                    questTitle: quest.title 
                                })}
                           />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                        <PlusCircleIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
                        <h3 className="text-2xl font-bold font-heading text-primary">No Quests Found</h3>
                        <p className="text-secondary max-w-xs mx-auto mt-2">
                            {currentAccount 
                                ? "You haven't created any quests yet, or there was an issue loading them."
                                : "Please connect your wallet."
                            }
                        </p>
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