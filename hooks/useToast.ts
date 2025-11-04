import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// In a real app with context, this hook would be more complex.
// For this app structure, the logic is managed in App.tsx and passed down.
// This file primarily serves to define the types.
const useToast = () => {
    // This is a placeholder hook. The actual state management is in App.tsx
    // to ensure it's at the top level and accessible to the entire app.
    // This demonstrates how you might structure it with a Context Provider.
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
};

export default useToast;