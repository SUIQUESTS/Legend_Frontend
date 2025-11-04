import React from 'react';
import { AwardIcon, HammerIcon, UsersIcon, GiftIcon } from '../icons';
import { Notification } from './DashboardLayout';

interface NotificationPanelProps {
    notifications: Notification[];
    onClearAll: () => void;
}

// Helper to get an icon based on notification type
const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'achievement':
            return <AwardIcon className="w-6 h-6 text-amber-400" />;
        case 'quest':
            return <HammerIcon className="w-6 h-6 text-accent" />;
        case 'leaderboard':
            return <UsersIcon className="w-6 h-6 text-secondary" />;
        case 'reward':
            return <GiftIcon className="w-6 h-6 text-green-400" />;
        default:
            return <div className="w-6 h-6 bg-border rounded-full" />;
    }
};

// Helper to format time
const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClearAll }) => {
    return (
        <div style={{ fontFamily: "helvetica" }} className="absolute top-full right-0 mt-3 w-80 max-w-sm bg-surface/80 backdrop-blur-lg border border-border rounded-xl shadow-2xl z-50 animate-content-fade-in origin-top-right">
            <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-bold font-heading text-primary">Notifications</h3>
                <button
                    onClick={onClearAll}
                    disabled={notifications.length === 0}
                    className="text-xs font-semibold text-accent hover:underline disabled:text-secondary disabled:no-underline"
                >
                    Clear All
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notif, index) => (
                            <li key={notif.id} className={`p-4 flex gap-4 items-start ${index < notifications.length - 1 ? 'border-b border-border' : ''} hover:bg-surface-dark transition-colors`}>
                                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                                <div>
                                    <p className="text-sm text-primary leading-tight">{notif.text}</p>
                                    <p className="text-xs text-secondary mt-1">{formatTimeAgo(notif.timestamp)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-10 text-center">
                        <p className="text-secondary text-sm">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;