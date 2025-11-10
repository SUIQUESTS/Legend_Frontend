import React, { useState } from 'react';
import { AwardIcon, HammerIcon, UsersIcon, GiftIcon, XIcon, LoaderIcon } from '../icons';
import { Notification } from './DashboardLayout';
import axios from 'axios';

interface NotificationPanelProps {
    notifications: Notification[];
    onClearAll: () => void;
    onDeleteNotification: (notificationId: string) => void;
    isLoading?: boolean;
}

// Helper to get an icon based on notification type
const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'challenge_win':
            return <AwardIcon className="w-6 h-6 text-amber-400" />;
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
const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
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

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
    notifications, 
    onClearAll, 
    onDeleteNotification,
    isLoading = false 
}) => {
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    const handleDeleteNotification = async (notificationId: string) => {
        setDeletingIds(prev => new Set(prev).add(notificationId));
        try {
            await axios.delete(
                `https://legendbackend-a29sm.sevalla.app/api/notifications/${notificationId}`
            );
            onDeleteNotification(notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        }
    };

    const handleClearAll = async () => {
        // Delete all notifications one by one
        for (const notification of notifications) {
            await handleDeleteNotification(notification._id);
        }
        onClearAll();
    };

    return (
        <div style={{ fontFamily: "helvetica" }} className="absolute top-full right-0 mt-3 w-80 max-w-sm bg-surface/80 backdrop-blur-lg border border-border rounded-xl shadow-2xl z-50 animate-content-fade-in origin-top-right">
            <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-bold font-heading text-primary">Notifications</h3>
                <button
                    onClick={handleClearAll}
                    disabled={notifications.length === 0 || isLoading}
                    className="text-xs font-semibold text-accent hover:underline disabled:text-secondary disabled:no-underline disabled:cursor-not-allowed"
                >
                    Clear All
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="p-10 text-center">
                        <LoaderIcon className="w-6 h-6 mx-auto animate-spin text-secondary mb-2" />
                        <p className="text-secondary text-sm">Loading notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notif, index) => (
                            <li 
                                key={notif._id} 
                                className={`p-4 flex gap-3 items-start group relative ${
                                    index < notifications.length - 1 ? 'border-b border-border' : ''
                                } hover:bg-surface-dark transition-colors`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-primary leading-tight">
                                        {notif.title}
                                    </p>
                                    <p className="text-sm text-secondary leading-tight mt-1">
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-secondary/70 mt-2">
                                        {formatTimeAgo(notif.createdAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteNotification(notif._id)}
                                    disabled={deletingIds.has(notif._id)}
                                    className="flex-shrink-0 p-1 rounded-full hover:bg-border transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                                    aria-label="Delete notification"
                                >
                                    {deletingIds.has(notif._id) ? (
                                        <LoaderIcon className="w-4 h-4 animate-spin text-secondary" />
                                    ) : (
                                        <XIcon className="w-4 h-4 text-secondary" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-10 text-center">
                        <p className="text-secondary text-sm">You're all caught up!</p>
                        <p className="text-secondary/70 text-xs mt-1">No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;