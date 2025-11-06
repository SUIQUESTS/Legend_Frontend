import React, { useEffect, useState } from 'react';
import MyQuestCard from './MyQuestCard';
import { Quest } from './QuestCard';
import { PlusCircleIcon } from '../icons';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { NFT } from './NFTSelector';
import axios from 'axios';


const provider = new SuiClient({ url: getFullnodeUrl('testnet') });


const allQuestsData: Quest[] = [
  { id: "1", title: "Master the Sui SDK", difficulty: "Hard", category: "Development", participants: 12, nftBadge: { name: "Sui Sovereign", image: "https://picsum.photos/seed/nft1/64", points: 500 }, creator: '@DevWizard', status: 'Live', winner: null },
  { id: "2", title: "Create a Viral Meme", difficulty: "Easy", category: "Community", participants: 88, nftBadge: { name: "Meme Maestro", image: "https://picsum.photos/seed/nft2/64", points: 50 }, creator: '@MemeLord', status: 'Live', winner: null },
  { id: "3", title: "Design a Legendary NFT", difficulty: "Medium", category: "Art", participants: 34, nftBadge: { name: "Pixel Paladin", image: "https://picsum.photos/seed/nft3/64", points: 250 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: "4", title: "Write a Sui Tutorial", difficulty: "Medium", category: "Content", participants: 21, nftBadge: { name: "Scroll Scribe", image: "https://picsum.photos/seed/nft4/64", points: 200 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: "5", title: "Build a DeFi dApp", difficulty: "Hard", category: "Development", participants: 5, nftBadge: { name: "DeFi Demigod", image: "https://picsum.photos/seed/nft5/64", points: 1000 }, creator: '@DevWizard', status: 'Live', winner: null },
  { id: "6", title: "Host a Community Workshop", difficulty: "Medium", category: "Community", participants: 45, nftBadge: { name: "Community Sage", image: "https://picsum.photos/seed/nft6/64", points: 300 }, creator: '@CyberGlory', status: 'Live', winner: null },
  { id: "7", title: "Pixel Art Sprite Contest", difficulty: "Easy", category: "Art", participants: 150, nftBadge: { name: "Sprite Sorcerer", image: "https://picsum.photos/seed/nft7/64", points: 75 }, creator: '@Artisan', status: 'Completed', winner: '@SuiSeeker' },
  { id: "8", title: "Translate Documentation", difficulty: "Easy", category: "Content", participants: 30, nftBadge: { name: "Lingua Legend", image: "https://picsum.photos/seed/nft8/64", points: 100 }, creator: '@CyberGlory', status: 'Live', winner: null },
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
    const [nfts, setNfts] = useState([]);
    const [quests, setQuests] = useState([]);
    const owner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";



        useEffect(() => {
            async function getAllQuests() {
                try {
                    const { data } = await axios.get('https://legendbackend-a29sm.sevalla.app/api/challenges/getall');
                    console.log("Quests Data:", data);
                    setQuests(data)
                } catch (error) {
                    console.error("Error fetching quests data:", error);
                }
            }
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
        
                    setNfts(transformedNfts.filter((nft, index) => index !== 3));
                } catch (error) {
                    console.error("Error fetching NFTs:", error);
                }
            }
        
            getAllNFTs();
            
        }, [owner]);


        


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