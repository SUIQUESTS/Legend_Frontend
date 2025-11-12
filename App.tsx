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
  name: string;
  score: number;
}

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [username, setUsername] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const handleNavigateToProfile = () => {
    console.log('Navigating to profile creation');
    setViewState('profile_creation');
  };

  const handleNavigateToDashboard = (userData: UserData) => {
    console.log('Navigating to dashboard with user:', userData);
    setUserData(userData);
    setUsername(userData.name);
    localStorage.setItem('username', userData.name);
    setViewState('dashboard');
  };

  const handleEnter = () => {
    if (username) {
      setViewState('dashboard');
    } else {
      setViewState('profile_creation');
    }
  };

  const handleProfileCreated = (userData: UserData) => {
    setUserData(userData);
    setUsername(userData.name);
    localStorage.setItem('username', userData.name);
    setViewState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    setUserData(null);
    setViewState('landing');
  };

  const renderContent = () => {
    switch(viewState) {
      case 'landing':
        return (
          <LandingPage 
            onEnter={handleEnter} 
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );
      case 'profile_creation':
        return <ProfileCreation onProfileCreated={handleProfileCreated} />;
      case 'dashboard':
        return <DashboardLayout username={username!} onLogout={handleLogout} addToast={addToast} />;
      default:
        return (
          <LandingPage 
            onEnter={handleEnter} 
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        );
    }
  }

  return (
    <div className="relative overflow-x-hidden w-full min-h-screen">
      <CustomCursor />
      {renderContent()}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;