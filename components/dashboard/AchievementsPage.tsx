import React, { useEffect, useState } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import AchievementCard from './AchievementCard';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { useCurrentAccount } from '@mysten/dapp-kit';
import { TrophyIcon } from '../icons';
import axios from 'axios';

const provider = new SuiClient({ url: getFullnodeUrl('testnet') });

export interface NFT {
  id: string;
  name: string;
  image: string;
  points: number;
}

interface ApiAchievement {
  _id: string;
  userAddress: string;
  nft_id: string;
  image: string;
  title: string;
  points: number;
  challengeId: string;
  dateEarned: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiAchievementsResponse {
  userAddress: string;
  achievements: ApiAchievement[];
}

interface Achievement {
  id: string;
  name: string;
  image: string;
  points: number;
  nft_id?: string;
  dateEarned: string;
  challengeId: string;
}

interface AchievementsPageProps {
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ onNavigate }) => {
    const [sectionRef, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
    const currentAccount = useCurrentAccount();
    const owner = currentAccount?.address || "";
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mainOwner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";

    // Fetch user's NFTs
    useEffect(() => {
        async function getAllNFTs() {
            if (!owner) {
                setIsLoading(false);
                return;
            }

            const packageId = "0xedf2c6c215b787828e9a05b0d07b9b2309fe573d23e0812ab1ceb489debc5742";
            try {
                const objects = await provider.getOwnedObjects({
                    owner: mainOwner,
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

                setNfts(transformedNfts);
            } catch (error) {
                // console.error("Error fetching NFTs:", error);
                setError('Failed to load your NFTs');
            }
        }
        
        getAllNFTs();
    }, [owner]);

    // Fetch user's achievements from API
    useEffect(() => {
        async function getAchievements() {
            if (!currentAccount?.address) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                const response = await axios.get<ApiAchievementsResponse>(
                    `https://legendbackend-a29sm.sevalla.app/api/challenges/${currentAccount.address}/achievements`
                );

                // console.log("Achievements API response:", response.data);

                if (response.data && response.data.achievements) {
                    // Transform API achievements to match our Achievement interface

                    const transformedAchievements: Achievement[] = response.data.achievements.map(apiAchievement => ({
                        id: apiAchievement._id,
                        name: apiAchievement.title,
                        image: apiAchievement.image,
                        points: apiAchievement.points,
                        dateEarned: apiAchievement.dateEarned,
                        challengeId: apiAchievement.challengeId,
                        nft_id: apiAchievement.nft_id
                    }));

                    // console.log("Transformed achievements:", transformedAchievements);

                    setAchievements(transformedAchievements);
                } else {
                    setAchievements([]);
                }
            } catch (error: any) {
                // console.error("Error fetching achievements:", error);
                if (error.response?.status === 404) {
                    // No achievements found for this user
                    setAchievements([]);
                } else {
                    setError('Failed to load your achievements');
                }
            } finally {
                setIsLoading(false);
            }
        }

        getAchievements();
    }, [currentAccount?.address]);

    // Combine achievements with NFT data
    const combinedAchievements = achievements.map(achievement => {
        // Try to find matching NFT by ID
        const matchingNft = nfts.find(nft => nft.id === achievement.nft_id);
        
        // console.log("Matching NFT for achievement:", nfts);
        // Use NFT data if found, otherwise use achievement data
        return {
            ...achievement,
            name: matchingNft?.name || achievement.name,
            image: matchingNft?.image || achievement.image,
            points: matchingNft?.points || achievement.points
        };
    });

    // console.log("Combined achievements:", combinedAchievements);
    // console.log("Available NFTs:", nfts);

    if (!currentAccount) {
        return (
            <div style={{ fontFamily: "helvetica" }} className="p-8 space-y-10 animate-content-fade-in">
                <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                    <TrophyIcon className="w-24 h-24 mx-auto text-secondary/30 mb-6" />
                    <h3 className="text-2xl font-bold font-heading text-primary mb-4">Connect Your Wallet</h3>
                    <p className="text-secondary max-w-md mx-auto mb-8">
                        Please connect your wallet to view your achievements.
                    </p>
                </div>
            </div>
        );
    }

    if (error && achievements.length === 0) {
        return (
            <div style={{ fontFamily: "helvetica" }} className="p-8 space-y-10 animate-content-fade-in">
                <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                    <TrophyIcon className="w-24 h-24 mx-auto text-secondary/30 mb-6" />
                    <h3 className="text-2xl font-bold font-heading text-primary mb-4">Error Loading Achievements</h3>
                    <p className="text-secondary max-w-md mx-auto mb-8">
                        {error}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="group relative font-semibold text-primary px-8 py-3 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "helvetica" }} ref={sectionRef} className="p-8 space-y-10 animate-content-fade-in">
            <header>
                <h1 className="text-4xl font-bold font-heading text-primary">Hall of Achievements</h1>
                <p className="mt-2 text-secondary max-w-2xl">
                    A collection of your earned NFT badges, immortalized on the blockchain. Your legend is written here.
                    {combinedAchievements.length > 0 && ` (${combinedAchievements.length} achievements earned)`}
                </p>
            </header>

            <section>
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                        <p className="mt-4 text-secondary">Loading your achievements...</p>
                    </div>
                ) : combinedAchievements.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {combinedAchievements.map((achievement, index) => (
                            <AchievementCard 
                                key={achievement.id} 
                                achievement={achievement} 
                                index={index} 
                                isVisible={isVisible} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
                        <TrophyIcon className="w-24 h-24 mx-auto text-secondary/30 mb-6" />
                        <h3 className="text-2xl font-bold font-heading text-primary mb-4">No achievements yet</h3>
                        <p className="text-secondary max-w-md mx-auto mb-2">
                            Your journey to greatness begins now. Complete quests and challenges to earn legendary NFT badges.
                        </p>
                        <p className="text-secondary max-w-md mx-auto mb-8">
                            Each achievement you earn will be forever immortalized on the blockchain for all to see.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={() => onNavigate('Quests')}
                                className="group relative font-semibold text-primary px-8 py-3 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent"
                            >
                                Explore Quests
                            </button>
                            <button 
                                onClick={() => onNavigate('Create Quest')}
                                className="group relative font-semibold text-primary px-8 py-3 bg-surface border-2 border-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:bg-accent/10"
                            >
                                Create a Quest
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AchievementsPage;