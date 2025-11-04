import React, { useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

const hallOfFameData = [
  { id: 1, user: "@SuiMaster", submission: "Sui Type-Safety Guide", image: "https://picsum.photos/seed/hof1/500/700", type: "Article" },
  { id: 2, user: "@CryptoArtist", submission: "Cyberpunk Sui City", image: "https://picsum.photos/seed/hof2/500/800", type: "Artwork" },
  { id: 3, user: "@DevWizard", submission: "On-Chain Game Logic", image: "https://picsum.photos/seed/hof3/500/600", type: "Code" },
  { id: 4, user: "@MemeLord", submission: "Sui vs Everybody", image: "https://picsum.photos/seed/hof4/500/500", type: "Meme" },
  { id: 5, user: "@TutorialQueen", submission: "First Sui dApp Video", image: "https://picsum.photos/seed/hof5/500/750", type: "Video" },
  { id: 6, user: "@NFThinker", submission: "Dynamic NFT Standard", image: "https://picsum.photos/seed/hof6/500/650", type: "Concept" },
];

const FameCard: React.FC<{ item: typeof hallOfFameData[0], index: number }> = ({ item, index }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
    const imageRef = useRef<HTMLImageElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const moveX = ((x - rect.width / 2) / (rect.width / 2)) * -8;
        const moveY = ((y - rect.height / 2) / (rect.height / 2)) * -8;
        imageRef.current.style.transform = `scale(1.15) translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
        if (!imageRef.current) return;
        imageRef.current.style.transform = 'scale(1.1) translate(0px, 0px)';
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`group relative rounded-xl overflow-hidden cursor-pointer break-inside-avoid mb-6 transition-all duration-700 ease-out border-2 border-transparent hover:border-accent-soft/50 shadow-lg ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
        >
            <img 
                ref={imageRef} 
                src={item.image} 
                alt={item.submission} 
                className="w-full h-auto object-cover" 
                style={{transform: 'scale(1.1)', transition: 'transform 0.4s ease-out'}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-1/4 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                <span style={{  fontFamily: "helvetica" }} className="inline-block px-3 py-1 bg-accent/80 text-background text-xs font-bold rounded-full mb-2 backdrop-blur-sm">{item.type}</span>
                <h3 className="text-xl font-bold text-primary font-heading">{item.submission}</h3>
                <p style={{  fontFamily: "helvetica" }} className="text-secondary opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-full transition-all duration-300 delay-100">by {item.user}</p>
            </div>
             <div className="absolute top-4 right-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

const HallOfFameSection: React.FC = () => {
    const [titleRef, isTitleVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });

    return (
        <section id="hall-of-fame" className="py-20 md:py-28 bg-surface-dark/30">
            <div className="container mx-auto px-6">
                <div 
                    ref={titleRef} 
                    className={`text-center mb-16 transition-all duration-700 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary uppercase">Immortal Legends</h2>
                    <p style={{  fontFamily: "helvetica" }} className="mt-4 text-lg text-secondary max-w-2xl mx-auto">A showcase of the greatest deeds accomplished by the community.</p>
                </div>
                <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
                    {hallOfFameData.map((item, index) => (
                        <FameCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HallOfFameSection;