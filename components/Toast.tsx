import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from './icons';
import { Toast as ToastProps } from '../hooks/useToast';

interface Props extends ToastProps {
  removeToast: (id: number) => void;
}

const toastConfig = {
    success: {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        barClass: 'bg-green-400',
    },
    error: {
        icon: <XCircleIcon className="w-6 h-6 text-red-400" />,
        barClass: 'bg-red-400',
    },
    info: {
        icon: <InformationCircleIcon className="w-6 h-6 text-accent" />,
        barClass: 'bg-accent',
    },
};

const Toast: React.FC<Props> = ({ id, message, type = 'success', removeToast }) => {
    const [isExiting, setIsExiting] = useState(false);
    const config = toastConfig[type];
    const duration = 5000;

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration);

        const removeTimer = setTimeout(() => {
            removeToast(id);
        }, duration + 500); // 500ms for exit animation

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [id, removeToast]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(id), 500);
    };

    return (
        <div 
            className={`relative flex items-start w-full max-w-xs sm:max-w-sm p-3 sm:p-4 bg-surface/80 backdrop-blur-lg border border-border rounded-xl shadow-2xl overflow-hidden ${
                isExiting ? 'animate-toast-out' : 'animate-toast-in'
            }`}
            role="alert"
        >
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="ml-2 sm:ml-3 flex-1">
                <p className="text-xs sm:text-sm font-medium text-primary">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="ml-2 sm:ml-4 flex-shrink-0 text-secondary hover:text-primary transition-colors"
                aria-label="Close"
            >
                <XCircleIcon className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            <div className={`absolute bottom-0 left-0 h-1 ${config.barClass}`} style={{ width: '100%', animation: `shrink ${duration}ms linear forwards` }}></div>
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default Toast;