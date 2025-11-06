import React, { useState, useMemo, useEffect } from 'react';
import NFTSelector, { NFT } from './NFTSelector';
import { ToastType } from '../../hooks/useToast';
import QuestPreviewCard from './QuestPreviewCard';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { useCurrentAccount } from '@mysten/dapp-kit';
import axios from 'axios';

const provider = new SuiClient({ url: getFullnodeUrl('testnet') });

interface CreateQuestPageProps {
    onNavigate: (pageName: string, params?: Record<string, any>) => void;
    addToast: (message: string, type?: ToastType) => void;
    
}


// Enhanced input components with character counters and better styling
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }> = ({ label, id, error, value, maxLength, ...props }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
             <label htmlFor={id} className="block text-sm font-medium text-secondary">{label}</label>
             {maxLength && (
                <span className="text-xs text-secondary">{`${String(value || '').length} / ${maxLength}`}</span>
             )}
        </div>
        <input
            id={id}
            value={value}
            maxLength={maxLength}
            className={`w-full bg-surface/50 border-2 rounded-lg text-primary px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 backdrop-blur-sm ${
                error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-border focus:border-accent focus:ring-accent/50'
            }`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1.5 animate-content-fade-in">{error}</p>}
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }> = ({ label, id, error, value, maxLength, ...props }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor={id} className="block text-sm font-medium text-secondary">{label}</label>
            {maxLength && (
                <span className="text-xs text-secondary">{`${String(value || '').length} / ${maxLength}`}</span>
            )}
        </div>
        <textarea
            id={id}
            value={value}
            maxLength={maxLength}
            rows={4}
            className={`w-full bg-surface/50 border-2 rounded-lg text-primary px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 backdrop-blur-sm ${
                error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-border focus:border-accent focus:ring-accent/50'
            }`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1.5 animate-content-fade-in">{error}</p>}
    </div>
);



const CreateQuestPage: React.FC<CreateQuestPageProps> = ({ onNavigate, addToast }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [participantLimit, setParticipantLimit] = useState<number | ''>(50);
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [nfts, setNfts] = useState([]);
    const currentAccount = useCurrentAccount();
    const owner = "0xd85b63bd1d19a39d29539c6a512d2a8a04ae3ad3d1c756346fb937722d3a7c05";

    const handleUnlimitedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsUnlimited(e.target.checked);
        setErrors(prev => ({...prev, participantLimit: ''})); // Clear error on change
        if (e.target.checked) {
            setParticipantLimit('');
        } else {
            setParticipantLimit(50); // Reset to default
        }
    };

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

    // console.log("Available NFTs:", nfts);


    
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = "Title is required.";
        if (title.length > 50) newErrors.title = "Title cannot exceed 50 characters.";
        if (!description.trim()) newErrors.description = "Description is required.";
        if (description.length > 300) newErrors.description = "Description cannot exceed 300 characters.";
        if (!isUnlimited && (!participantLimit || participantLimit < 1)) {
            newErrors.participantLimit = "Limit must be at least 1.";
        }
        if (!deadline) {
            newErrors.deadline = "Deadline is required.";
        } else if (new Date(deadline) <= new Date()) {
            newErrors.deadline = "Deadline must be in the future.";
        }
        if (!selectedNft) newErrors.nft = "You must select a reward NFT.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const questData = {
                    creator: currentAccount?.address || '',
                    title,
                    description,
                    participant_limit: isUnlimited ? 'unlimited' : participantLimit,
                    deadline,
                    nft_id: selectedNft?.id,
                    status: 'active',
                };
                console.log("Creating Quest:", questData);
                const { data } = await axios.post('https://legendbackend-a29sm.sevalla.app/api/challenges/create', questData);
                console.log("Server Response:", data);
                addToast(`Quest created successfully!`);
                onNavigate('Quests');
                // alert('Quest created successfully! (Check console for data)');
            } catch (error) {
                console.error("Error creating quest:", error);
                alert('Failed to create quest. Please try again.');
            }
        }
    };
    
    const isFormValid = useMemo(() => {
        return title.trim() && description.trim() && (isUnlimited || (participantLimit && participantLimit > 0)) && deadline && new Date(deadline) > new Date() && selectedNft;
    }, [title, description, isUnlimited, participantLimit, deadline, selectedNft]);

    return (
        <div style={{ fontFamily: "helvetica" }} className="p-4 sm:p-8 space-y-12 animate-content-fade-in">
            <header className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                <h1 className="text-4xl font-bold font-heading text-primary">Create a New Quest</h1>
                <p className="mt-2 text-secondary max-w-2xl">Design a new challenge for the community and attach a reward for the victor.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 bg-surface/50 border border-border rounded-xl p-6 space-y-6 opacity-0 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>
                         <h2 className="text-2xl font-bold font-heading text-primary border-b border-border pb-4">Quest Details</h2>
                         <FormInput
                            id="title"
                            label="Quest Title"
                            type="text"
                            placeholder="e.g., Best Sui Meme Challenge"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            maxLength={50}
                            error={errors.title}
                         />
                        <FormTextarea
                            id="description"
                            label="Description"
                            placeholder="e.g., Create the funniest Sui-themed meme and submit it..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={300}
                            error={errors.description}
                        />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                 <FormInput
                                    id="participantLimit"
                                    label="Participant Limit"
                                    type="number"
                                    placeholder="e.g., 50"
                                    value={participantLimit}
                                    onChange={e => setParticipantLimit(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                    disabled={isUnlimited}
                                    min={1}
                                    error={errors.participantLimit}
                                 />
                                 <div className="flex items-center mt-3">
                                    <input
                                        type="checkbox"
                                        id="unlimited"
                                        checked={isUnlimited}
                                        onChange={handleUnlimitedChange}
                                        className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                                    />
                                    <label htmlFor="unlimited" className="ml-2 block text-sm text-secondary">Unlimited participants</label>
                                </div>
                            </div>
                            <div>
                                <FormInput
                                    id="deadline"
                                    label="Deadline"
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                    error={errors.deadline}
                                />
                            </div>
                        </div>
                    </div>

                     {/* Right Column: Live Preview */}
                    <div className="lg:col-span-1 opacity-0 animate-slide-in-fade" style={{ animationDelay: '300ms' }}>
                        <h2 className="text-lg font-bold font-heading text-primary mb-4 ml-2">Live Preview</h2>
                        <QuestPreviewCard
                            title={title}
                            description={description}
                            participantLimit={isUnlimited ? null : participantLimit}
                            nft={selectedNft}
                        />
                    </div>
                </div>
                
                {/* NFT Selection Section */}
=                <section className="opacity-0 animate-slide-in-fade" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-2xl font-bold font-heading text-primary mb-6">Select Reward NFT</h2>
                    {errors.nft && <p className="text-red-500 text-sm mb-4 animate-content-fade-in">{errors.nft}</p>}
                    <NFTSelector 
                        nfts={nfts}
                        selectedNftId={selectedNft?.id || null} 
                        onSelectNft={setSelectedNft} 
                    />
                </section>
                
                {/* Submission Button */}
                <div className="flex justify-end pt-6 border-t border-border opacity-0 animate-slide-in-fade" style={{ animationDelay: '500ms' }}>
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="group relative font-bold text-lg text-primary px-8 py-3 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none overflow-hidden"
                    >
                         <span className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.2)_55%,transparent_80%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                        <span className="relative z-10">Create Quest</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestPage;