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

// Placeholder components for other pages
const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8 animate-content-fade-in">
        <h1 className="text-4xl font-bold font-heading text-primary">{title}</h1>
        <p className="mt-4 text-secondary">This section is under construction.</p>
    </div>
);

// MOCK DATA for notifications
const initialNotifications = [
    { id: 1, type: 'achievement', text: 'You earned the "Sui Shadow Master" badge!', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: 2, type: 'quest', text: 'Quest "Design a Legendary NFT" progress: 50%', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 3, type: 'leaderboard', text: '@SuiSeeker just passed you on the leaderboard!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: 4, type: 'reward', text: 'You received a 100 SUI reward!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
];

export interface Notification {
  id: number;
  type: string;
  text: string;
  timestamp: Date;
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
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const handleClearNotifications = () => {
        setNotifications([]);
    };

    const navigateTo = (pageName: string, params?: Record<string, any>) => {
        setActivePage({ name: pageName, params });
    };

    const renderContent = () => {
        switch (activePage.name) {
            case 'Home':
                return <DashboardHome />;
            case 'Quests':
                return <LiveQuestsPage username={username} addToast={addToast} />;
            case 'Create Quest':
                return <CreateQuestPage />;
            case 'My Quests':
                return <MyQuestsPage username={username} onNavigate={navigateTo} />;
            case 'Submissions':
                 return <QuestSubmissionsPage questId={activePage.params?.questId} onNavigate={navigateTo} addToast={addToast} />;
            case 'Achievements':
                return <AchievementsPage />;
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
            <Sidebar activePage={activePage.name} setActivePage={(page) => navigateTo(page)} onLogout={onLogout} />
            <div className="flex-1 flex flex-col pl-20 group-hover:pl-20 lg:pl-24"> {/* Adjust pl for sidebar width */}
                <DashboardHeader 
                    username={username}
                    notifications={notifications}
                    onClearNotifications={handleClearNotifications}
                />
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;