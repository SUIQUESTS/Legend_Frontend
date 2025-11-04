import React from 'react';
import Toast from './Toast';
import { Toast as ToastProps } from '../hooks/useToast';

interface Props {
  toasts: ToastProps[];
  removeToast: (id: number) => void;
}

const ToastContainer: React.FC<Props> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-4 z-[9999] space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;