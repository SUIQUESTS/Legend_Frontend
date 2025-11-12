import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardHome from './DashboardHome';
import AchievementsPage from './AchievementsPage';
import LeaderboardPage from './LeaderboardPage';
import CreateQuestPage from './CreateQuestPage';
import LiveQuestsPage from './LiveQuestsPage';
import MyQuestsPage from './MyQuestsPage';
import QuestSubmissionsPage from './QuestSubmissionsPage';
import { ToastType } from '../../hooks/useToast';
import { useCurrentAccount } from '@mysten/dapp-kit';
import axios from 'axios';

// Placeholder components for other pages
const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8 animate-content-fade-in">
        <h1 className="text-4xl font-bold font-heading text-primary">{title}</h1>
        <p className="mt-4 text-secondary">This section is under construction.</p>
    </div>
);

// // MOCK DATA for notifications
// const initialNotifications = [
//     { id: 1, type: 'achievement', text: 'You earned the "Sui Shadow Master" badge!', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
//     { id: 2, type: 'quest', text: 'Quest "Design a Legendary NFT" progress: 50%', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
//     { id: 3, type: 'leaderboard', text: '@SuiSeeker just passed you on the leaderboard!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//     { id: 4, type: 'reward', text: 'You received a 100 SUI reward!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
// ];

export interface Notification {
  _id: string;
  userAddress: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ActivePage {
    name: string;
    params?: Record<string, any>;
}

interface DashboardLayoutProps {
    username: string;
    onLogout: () => void;
    addToast: (message: string, type?: ToastType) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ username, onLogout, addToast }) => {
    const [activePage, setActivePage] = useState<ActivePage>({ name: 'Home' });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const currentAccount = useCurrentAccount();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const loadNotifications = async () => {
        if (!currentAccount?.address) return;
        
        try {
            const response = await axios.get(
                `https://legendbackend-a29sm.sevalla.app/api/notifications/${currentAccount.address}`
            );
            
            if (response.data && response.data.data) {
                setNotifications(response.data.data);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            // console.error('Error loading notifications:', error);
            addToast('Failed to load notifications', 'error');
        }
    };

    // Delete a single notification
    const handleDeleteNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    };

    // Clear all notifications
    const handleClearNotifications = () => {
        setNotifications([]);
    };


    const navigateTo = (pageName: string, params?: Record<string, any>) => {
        setActivePage({ name: pageName, params });
        // Close sidebar when navigating on mobile
        setIsSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activePage.name) {
            case 'Home':
                return <DashboardHome />;
            case 'Quests':
                return <LiveQuestsPage username={username} addToast={addToast} />;
            case 'Create Quest':
                return <CreateQuestPage onNavigate={navigateTo} addToast={addToast} />;
            case 'My Quests':
                return <MyQuestsPage username={username} onNavigate={navigateTo} />;
            case 'Submissions':
                return <QuestSubmissionsPage questId={activePage.params?.questId} onNavigate={navigateTo} addToast={addToast} />;
            case 'Achievements':
                return <AchievementsPage onNavigate={navigateTo} />;
            case 'Leaderboard':
                return <LeaderboardPage />;
            case 'Settings':
                return <PlaceholderComponent title="Settings" />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="flex min-h-screen bg-background bg-grid-pattern bg-grid-size">
            {/* Mobile sidebar overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            {/* Sidebar - hidden on mobile by default, shown when isSidebarOpen is true */}
            <div 
                className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <Sidebar 
                    activePage={activePage.name} 
                    setActivePage={(page) => navigateTo(page)} 
                    onLogout={onLogout} 
                />
            </div>
            
            <div className="flex-1 flex flex-col">
                {/* Pass the sidebar toggle function to the header */}
                <DashboardHeader 
                    username={username}
                    notifications={notifications}
                    onClearNotifications={handleClearNotifications}
                    onDeleteNotification={handleDeleteNotification}
                    onLoadNotifications={loadNotifications}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;