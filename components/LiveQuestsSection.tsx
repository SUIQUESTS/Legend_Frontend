import React from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

const questsData = [
  { 
    id: 1, 
    title: "Master the Sui SDK", 
    difficulty: "Hard", 
    nftBadge: { name: "Sui Sovereign", image: "https://picsum.photos/seed/nft1/64", points: 500 }, 
    participants: 12, 
    category: "Development" 
  },
  { 
    id: 2, 
    title: "Create a Viral Meme", 
    difficulty: "Easy", 
    nftBadge: { name: "Meme Maestro", image: "https://picsum.photos/seed/nft2/64", points: 50 }, 
    participants: 88, 
    category: "Community" 
  },
  { 
    id: 3, 
    title: "Design a Legendary NFT", 
    difficulty: "Medium", 
    nftBadge: { name: "Pixel Paladin", image: "https://picsum.photos/seed/nft3/64", points: 250 }, 
    participants: 34, 
    category: "Art" 
  },
  { 
    id: 4, 
    title: "Write a Sui Tutorial", 
    difficulty: "Medium", 
    nftBadge: { name: "Scroll Scribe", image: "https://picsum.photos/seed/nft4/64", points: 200 }, 
    participants: 21, 
    category: "Content" 
  },
];

const difficultyColor: { [key: string]: string } = {
    "Easy": "bg-green-500/10 text-green-400 border border-green-500/20",
    "Medium": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    "Hard": "bg-red-500/10 text-red-400 border border-red-500/20",
};

const QuestCard: React.FC<{ quest: typeof questsData[0]; index: number; isVisible: boolean }> = ({ quest, index, isVisible }) => {
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = -1 * ((y - rect.height / 2) / (rect.height / 2)) * 8;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;

        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative bg-surface backdrop-blur-md border border-border rounded-2xl shadow-lg transition-all duration-500 ease-out group overflow-hidden ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
           style={{ 
               transitionProperty: 'opacity, transform', 
               transitionDelay: isVisible ? `${index * 100}ms` : '0ms' 
            }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_250px_at_var(--x)_var(--y),_rgba(0,245,255,0.15),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
          <div className="p-6 relative z-10">
            <div style={{  fontFamily: "helvetica" }} className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-soft">{quest.category}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColor[quest.difficulty]}`}>{quest.difficulty}</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-primary mb-2">{quest.title}</h3>
            
            <div style={{  fontFamily: "helvetica" }} className="flex justify-between items-center bg-surface-dark p-3 rounded-lg my-4">
                <div className="flex items-center gap-3">
                    <img src={quest.nftBadge.image} alt={quest.nftBadge.name} className="w-10 h-10 rounded-md object-cover border-2 border-accent-soft/30" />
                    <div>
                        <p className="text-xs text-secondary">NFT Badge</p>
                        <p className="font-bold text-accent-soft">{quest.nftBadge.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-secondary">Points</p>
                    <p className="font-bold text-primary text-lg">{quest.nftBadge.points}</p>
                </div>
            </div>

            <div style={{  fontFamily: "helvetica" }} className="text-secondary text-sm mb-4">
                 <span>Participants: <span className="font-bold text-primary">{quest.participants}</span></span>
            </div>
            <div className="w-full bg-surface-dark rounded-full h-2 mb-6 overflow-hidden">
                <div className="bg-accent h-full rounded-full transition-all duration-500 group-hover:bg-accent-soft" style={{ width: `${(quest.participants / 100) * 100}%` }}></div>
            </div>
            <button style={{  fontFamily: "helvetica" }} className="w-full text-center py-2 font-bold bg-accent text-background rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent focus:outline-none focus:ring-4 focus:ring-accent/50">
                Join Quest
            </button>
          </div>
        </div>
    );
};


const LiveQuestsSection: React.FC = () => {
    const [sectionRef, isSectionVisible] = useOnScreen<HTMLElement>({ threshold: 0.2, triggerOnce: true });
    
    return (
        <section ref={sectionRef} id="quests" className="py-20 md:py-28 overflow-hidden bg-background">
            <div className="container mx-auto px-6">
                 <div 
                    className={`text-center mb-16 transition-all duration-700 ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary uppercase">Live Challenges</h2>
                    <p style={{  fontFamily: "helvetica" }} className="mt-4 text-lg text-secondary max-w-2xl mx-auto">New quests arrive continuously. Your next legend awaits.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {questsData.map((quest, index) => (
                        <QuestCard key={quest.id} quest={quest} index={index} isVisible={isSectionVisible} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LiveQuestsSection;