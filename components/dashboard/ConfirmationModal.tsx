import React, { useEffect } from 'react';
import { XCircleIcon, InformationCircleIcon } from '../icons';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm", 
    cancelText = "Cancel" 
}) => {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-modal-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-8 animate-modal-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                        <InformationCircleIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-primary">{title}</h2>
                        <p className="mt-2 text-secondary">{message}</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 font-semibold bg-surface-dark border border-border text-primary rounded-lg hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-border transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 font-bold bg-accent text-primary rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent focus:outline-none focus:ring-4 focus:ring-accent/50"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;