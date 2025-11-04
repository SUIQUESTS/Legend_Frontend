import React from 'react';
import { NFT } from './NFTSelector';
import { UsersIcon } from '../icons';

interface QuestPreviewCardProps {
    title: string;
    description: string;
    participantLimit: number | '' | null;
    nft: NFT | null;
}

const QuestPreviewCard: React.FC<QuestPreviewCardProps> = ({ title, description, participantLimit, nft }) => {
    const displayTitle = title || "Your Quest Title";
    const displayDescription = description || "Your quest description will appear here. Make it exciting and clear for participants to understand.";
    const displayLimit = participantLimit === null ? '∞' : (participantLimit || '??');

    return (
        <div className="sticky top-28">
            <div className="relative bg-surface border border-border rounded-xl shadow-lg group overflow-hidden p-6 transition-all duration-300 h-[450px] flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(56,123,255,0.1),_transparent_40%)]"></div>
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">Community</span>
                        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <UsersIcon className="w-3 h-3" />
                            <span>{displayLimit}</span>
                        </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold font-heading text-primary mb-2 min-h-[56px] break-words">
                        {displayTitle}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-secondary text-sm flex-grow min-h-[96px] break-words">
                        {displayDescription}
                    </p>
                    
                    {/* NFT Badge */}
                    <div className="flex justify-between items-center bg-background p-3 rounded-lg my-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-surface-dark border-2 border-dashed border-border flex items-center justify-center transition-all duration-300">
                                {nft ? (
                                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover rounded-[5px]" />
                                ) : (
                                    <span className="text-secondary text-xl">?</span>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-secondary">NFT Badge</p>
                                <p className="font-bold text-accent transition-all duration-300">
                                    {nft?.name || "Select a Badge"}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-secondary">Points</p>
                            <p className="font-bold text-primary text-lg transition-all duration-300">
                                {nft?.points || "0"}
                            </p>
                        </div>
                    </div>
                    
                    {/* Button */}
                    <button disabled className="w-full text-center py-2.5 font-bold bg-accent text-primary rounded-lg text-sm mt-auto opacity-50 cursor-not-allowed">
                        Join Quest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestPreviewCard;
