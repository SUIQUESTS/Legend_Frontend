import React, { useState, useEffect } from 'react';
import { Quest } from './QuestCard';
import { XCircleIcon, LinkIcon } from '../icons';

interface JoinQuestModalProps {
    quest: Quest;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (questId: string, link: string) => Promise<void>; // Changed to return Promise
}

const JoinQuestModal: React.FC<JoinQuestModalProps> = ({ quest, isOpen, onClose, onSubmit }) => {
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset form state when opening
            setLink('');
            setError('');
            setIsSubmitting(false);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const validateLink = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!link) {
            setError('Submission link cannot be empty.');
            return;
        }

        if (!validateLink(link)) {
            setError('Please enter a valid URL.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onSubmit(quest.id, link);
            // If onSubmit succeeds, the parent will close the modal
            // No need to reset here as the useEffect will handle it when modal closes
        } catch (error) {
            // Only handle the error state here, parent handles the toast
            setError('Submission failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            style={{ fontFamily: "helvetica" }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-modal-fade-in"
            onClick={handleClose}
        >
            <div 
                className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-8 animate-modal-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
                    aria-label="Close modal"
                    disabled={isSubmitting}
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>

                <div className="text-center">
                    <h2 className="text-3xl font-bold font-heading text-primary">{quest.title}</h2>
                    <p className="mt-2 text-secondary">Provide your submission link to join the quest.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="submission-link" className="block text-sm font-medium text-secondary mb-2">
                            Submission Link
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                            <input
                                type="url"
                                id="submission-link"
                                value={link}
                                onChange={e => setLink(e.target.value)}
                                placeholder="Provide Link to Submission"
                                disabled={isSubmitting}
                                className={`w-full bg-background border-2 rounded-lg text-primary pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ${
                                    error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-border focus:border-accent focus:ring-accent/50'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1.5 animate-content-fade-in">{error}</p>}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full group relative font-bold text-lg text-primary px-8 py-3 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.2)_55%,transparent_80%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                        <span className="relative z-10">
                            {isSubmitting ? 'Submitting...' : 'Submit & Join Quest'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinQuestModal;