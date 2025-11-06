import React, { useEffect } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import AchievementCard from './AchievementCard';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { useCurrentAccount } from '@mysten/dapp-kit';
import { TrophyIcon } from '../icons';

const provider = new SuiClient({ url: getFullnodeUrl('testnet') });

export interface NFT {
  id: string;
  name: string;
  image: string;
  points: number;
}

interface AchievementsPageProps {
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ onNavigate }) => {
    const [sectionRef, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
    const currentAccount = useCurrentAccount();
    const owner = currentAccount?.address || "";
    const [nfts, setNfts] = React.useState<NFT[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        async function getAllNFTs() {
            if (!owner) {
                setIsLoading(false);
                return;
            }

            const packageId = "0xedf2c6c215b787828e9a05b0d07b9b2309fe573d23e0812ab1ceb489debc5742";
            try {
                setIsLoading(true);
                const objects = await provider.getOwnedObjects({
                    owner: owner,
                    options: {
                        showType: true,
                        showContent: true,
                    },
                });

                // Transform the NFT data to match our NFT interface
                const transformedNfts = objects.data
                    .filter((object) => object.data?.type?.includes(`${packageId}::nft::NFT`))
                    .map((object) => {
                        // Check if content exists and has the moveObject dataType
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
                console.error("Error fetching NFTs:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        getAllNFTs();
    }, [owner]);

    console.log("Fetched NFTs:", nfts);

    return (
        <div style={{ fontFamily: "helvetica" }} ref={sectionRef} className="p-8 space-y-10 animate-content-fade-in">
            <header>
                <h1 className="text-4xl font-bold font-heading text-primary">Hall of Achievements</h1>
                <p className="mt-2 text-secondary max-w-2xl">A collection of your earned NFT badges, immortalized on the blockchain. Your legend is written here.</p>
            </header>

            <section>
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                        <p className="mt-4 text-secondary">Loading your achievements...</p>
                    </div>
                ) : nfts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {nfts.map((achievement, index) => (
                            <AchievementCard key={achievement.id} achievement={achievement} index={index} isVisible={isVisible} />
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