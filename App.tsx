import React, { useState, useEffect, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
import DashboardLayout from './components/dashboard/DashboardLayout';
import LandingPage from './components/LandingPage';
import ProfileCreation from './components/ProfileCreation';
import ToastContainer from './components/ToastContainer';
import { Toast, ToastType } from './hooks/useToast';

type ViewState = 'landing' | 'profile_creation' | 'dashboard';

interface UserData {
  id: string;
  walletAddress: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [username, setUsername] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleNavigateToProfile = () => {
    setCurrentView('profile_creation');
  };

  const handleNavigateToDashboard = (userData: UserData) => {
    setUserData(userData);
    setCurrentView('dashboard');
  };

  useEffect(() => {
    // Check for existing user on initial load
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const handleEnter = () => {
    if (username) {
      setViewState('dashboard');
    } else {
      setViewState('profile_creation');
    }
  };

  const handleProfileCreated = (newUsername: string) => {
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
    setViewState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    setViewState('landing');
  };

  const renderContent = () => {
    switch(viewState) {
      case 'landing':
        return <LandingPage onEnter={handleEnter} />;
      case 'profile_creation':
        return <ProfileCreation onProfileCreated={handleProfileCreated} />;
      case 'dashboard':
        return <DashboardLayout username={username!} onLogout={handleLogout} addToast={addToast} />;
      default:
        return <LandingPage onEnter={handleEnter} />;
    }
  }

  return (
    <div className="relative overflow-x-hidden">
      <CustomCursor />
      {renderContent()}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;