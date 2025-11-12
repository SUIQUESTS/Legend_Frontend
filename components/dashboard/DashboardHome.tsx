import React, { useEffect, useState, useMemo } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import StatCard from './StatCard';
import QuestCard, { Quest } from './QuestCard';
import { TrophyIcon, CrownIcon, HammerIcon, SparklesIcon } from '../icons';
import QuestFilters from './QuestFilters';
import { fetchUserChallenges } from '@/services/questService';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { NFT } from './NFTSelector';
import axios from 'axios';

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

interface LeaderboardEntry {
  userAddress: string;
  totalPoints: number;
  name: string;
}

interface LeaderboardResponse {
  message: string;
  data: LeaderboardEntry[];
}

const provider = new SuiClient({ url: getFullnodeUrl("testnet") });

const DashboardHome: React.FC = () => {
    const [statsRef, statsVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });
    const [dataLoaded, setDataLoaded] = useState(false);
    const currentAccount = useCurrentAccount();
    const [nfts, setNfts] = useState<NFT[]>([]);
    const owner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";
    const [apiQuests, setApiQuests] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDifficulty, setActiveDifficulty] = useState('All');
    const [achievements, setAchievements] = useState([]);
    const [totalPoint, setTotalPoints] = useState(0);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [position, setPosition] = useState(0);
    

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                
                // console.log("Starting to fetch leaderboard...");
                
                const response = await axios.get<LeaderboardResponse>(
                'https://legendbackend-a29sm.sevalla.app/api/challenges/leaderboard'
                );

                setPosition(response.data.data.findIndex(entry => entry.userAddress === currentAccount?.address) + 1)

                if (response.data && response.data.data) {

                setLeaderboardData(response.data.data);
                } else {
                setLeaderboardData([]);
                }
            } catch (error: any) {
                // console.error("Error fetching leaderboard:", error);
                // console.error("Error details:", error.response?.data);
                setLeaderboardData([]);
            }
        };

        fetchLeaderboard();
    }, []);

    

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
        
                setNfts(transformedNfts);
            } catch (error) {
                console.error("Error fetching NFTs:", error);
            }
        }
        
        getAllNFTs();
    }, [owner]);

    // Fetch challenges
    useEffect(() => {
        if (currentAccount?.address) {
            fetchUserChallenges(currentAccount.address).then(data => {
                setApiQuests(data.won || []);
            }).catch(error => console.error('Error fetching user challenges:', error));
        }
    }, [currentAccount]);

    // Transform API quests to Quest format with NFT data
    const questData: Quest[] = useMemo(() => {
        return apiQuests.map((apiQuest): Quest => {
            // Find the matching NFT using nft_id
            const matchingNft = nfts.find(nft => nft.id === apiQuest.nft_id);
            
            // Determine category based on title
            const getCategory = (title: string): string => {
                const lowerTitle = title.toLowerCase();
                if (lowerTitle.includes('sui') || lowerTitle.includes('contract') || lowerTitle.includes('development')) return 'Development';
                if (lowerTitle.includes('design') || lowerTitle.includes('art')) return 'Art';
                if (lowerTitle.includes('meme') || lowerTitle.includes('community')) return 'Community';
                if (lowerTitle.includes('tutorial') || lowerTitle.includes('content')) return 'Content';
                return 'General';
            };

            // Determine difficulty based on reward points
            const getDifficulty = (points: number): string => {
                if (points <= 50) return 'Easy';
                if (points <= 150) return 'Medium';
                return 'Hard';
            };

            // Check if user has submitted (for progress)
            const userSubmission = apiQuest.submissions?.find(
                (sub: any) => sub.participant_address.toLowerCase() === currentAccount?.address?.toLowerCase()
            );

            return {
                id: apiQuest._id,
                title: apiQuest.title,
                description: apiQuest.description,
                category: getCategory(apiQuest.title),
                progress: userSubmission ? 100 : 0,
                difficulty: getDifficulty(apiQuest.rewardPoints || 100),
                participants: apiQuest.submissions?.length || 0,
                creator: apiQuest.creator,
                status: apiQuest.status === 'completed' ? 'Completed' : 'Live',
                winner: apiQuest.winner,
                nftBadge: {
                    name: matchingNft?.name || `${apiQuest.title} Badge`,
                    image: matchingNft?.image || `https://picsum.photos/seed/${apiQuest.nft_id}/64`,
                    points: matchingNft?.points || apiQuest.rewardPoints || 100
                }
            };
        });
        
    }, [apiQuests, nfts, currentAccount]);

    useEffect(() => {
        if (questData.length > 0 || nfts.length > 0) {
            setDataLoaded(true);
        }
    }, [questData, nfts]);

    const categories = ['All', ...Array.from(new Set(questData.map(q => q.category)))];
    const difficulties = ['All', ...Array.from(new Set(questData.map(q => q.difficulty)))];

    const filteredQuests = questData.filter(quest => {
        const categoryMatch = activeCategory === 'All' || quest.category === activeCategory;
        const difficultyMatch = activeDifficulty === 'All' || quest.difficulty === activeDifficulty;
        return categoryMatch && difficultyMatch;
    });
    
    // Filter quests - won quests are those with status "completed"
    const wonQuests = filteredQuests.filter(q => q.status === "Completed");
    const activeQuests = filteredQuests.filter(q => q.status === "Live");

    // Calculate stats
    const totalPoints = questData.reduce((sum, quest) => sum + quest.nftBadge.points, 0);
    const totalQuestsWon = wonQuests.length;
    const totalNFTs = nfts.length;


    useEffect(() => {
        const getAchievements = async () => {
            if (currentAccount?.address) {
                const response = await axios.get<ApiAchievementsResponse>(
                    `https://legendbackend-a29sm.sevalla.app/api/challenges/${currentAccount?.address}/achievements`
                );
                setAchievements(response.data.achievements);
                setTotalPoints(response.data.achievements.reduce((acc, achievement) => acc + achievement.points, 0));
            }
        };
        getAchievements();
    }, [questData]);

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 md:space-y-12 animate-content-fade-in">
            {/* Stats Section */}
            <section ref={statsRef}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard icon={<CrownIcon />} title="Current Rank" value={`#${position}`} index={0} isVisible={statsVisible} />
                    <StatCard icon={<TrophyIcon />} title="Total Points" value={totalPoint.toLocaleString()} index={1} isVisible={statsVisible} />
                    <StatCard icon={<HammerIcon />} title="Quests Won" value={totalQuestsWon.toString()} index={2} isVisible={statsVisible} />
                    <StatCard icon={<SparklesIcon />} title="NFTs Collected" value={achievements.length.toString()} index={3} isVisible={statsVisible} />
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
            
            {/* Won Quests Section */}
            {wonQuests.length > 0 && (
                <section>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-4 sm:mb-6">Quests You've Won</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {wonQuests.map((quest, index) => (
                            <QuestCard 
                                key={quest.id} 
                                quest={quest} 
                                index={index} 
                                isVisible={dataLoaded} 
                                participationStatus="joined"
                            />
                        ))}
                    </div>
                </section>
            )}
            
            {/* Active Quests Section */}
            <section>
                 <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-4 sm:mb-6">Your Active Quests</h2>
                 {activeQuests.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {activeQuests.map((quest, index) => (
                            <QuestCard 
                                key={quest.id} 
                                quest={quest} 
                                index={index} 
                                isVisible={dataLoaded} 
                                participationStatus={quest.progress === 100 ? "joined" : "not_joined"}
                            />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-8 sm:py-10 px-4 sm:px-6 bg-surface rounded-lg border border-border">
                        <p className="text-secondary">No active quests match your filters.</p>
                    </div>
                 )}
            </section>

            {/* No Quests Message */}
            {questData.length === 0 && (
                <section>
                    <div className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-surface rounded-lg border border-border">
                        <div className="text-5xl sm:text-6xl mb-4">🎯</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">No Quests Yet</h3>
                        <p className="text-secondary max-w-md mx-auto">
                            You haven't participated in any quests yet. Join some quests to start earning rewards and NFTs!
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default DashboardHome;