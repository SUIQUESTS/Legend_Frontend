import React from 'react';
import { CheckBadgeIcon } from '../icons';

export interface NFT {
  id: string;
  name: string;
  image: string;
  points: number;
}

interface NFTSelectorProps {
  nfts: NFT[];
  selectedNftId: string | null;
  onSelectNft: (nft: NFT) => void;
}

const NFTCard: React.FC<{ nft: NFT; isSelected: boolean; onSelect: () => void; }> = ({ nft, isSelected, onSelect }) => {    
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -1 * ((y - rect.height / 2) / (rect.height / 2)) * 8;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };
    
    return (
        <button
            type="button"
            onClick={onSelect}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative w-full aspect-square bg-surface border-2 rounded-xl shadow-lg transition-all duration-300 ease-out group overflow-hidden focus:outline-none ${
                isSelected ? 'border-accent shadow-glow-accent scale-105' : 'border-border hover:border-accent/50'
            }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_250px_at_var(--x)_var(--y),_rgba(56,123,255,0.1),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
            <img src={nft.image} alt={nft.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"></div>
            
            {isSelected && (
                <div className="absolute top-2 right-2 text-accent z-20 transition-all duration-300 transform-gpu animate-sparkle">
                    <CheckBadgeIcon className="w-8 h-8" />
                </div>
            )}

            <div className="relative z-10 p-4 flex flex-col justify-end h-full text-left">
                <h3 className="text-lg font-bold font-heading text-primary leading-tight">{nft.name}</h3>
                <p className="text-sm font-semibold text-accent">{nft.points} Points</p>
            </div>
        </button>
    )
};

const NFTSelector: React.FC<NFTSelectorProps> = ({ nfts, selectedNftId, onSelectNft }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {nfts.map(nft => (
        <NFTCard 
          key={nft.id}
          nft={nft}
          isSelected={selectedNftId === nft.id}
          onSelect={() => onSelectNft(nft)}
        />
      ))}
      
      {nfts.length === 0 && (
        <div className="col-span-full text-center py-12 text-secondary">
          <div className="text-lg mb-2">No NFTs found in your wallet</div>
          <div className="text-sm">Make sure you have NFTs from the correct collection</div>
        </div>
      )}
    </div>
    );
};

export default NFTSelector;