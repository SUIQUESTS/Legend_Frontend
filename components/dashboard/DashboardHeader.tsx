import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, MenuIcon } from '../icons';
import Tooltip from '../Tooltip';
import NotificationPanel from './NotificationPanel';
import { Notification } from './DashboardLayout';
import axios from 'axios';
import { useCurrentAccount } from '@mysten/dapp-kit';

// Add the XIcon import
import { XIcon } from '../icons';

interface DashboardHeaderProps {
    username: string;
    notifications: Notification[];
    onClearNotifications: () => void;
    onDeleteNotification: (notificationId: string) => void;
    onLoadNotifications: () => void;
    onToggleSidebar?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
    username, 
    notifications, 
    onClearNotifications, 
    onDeleteNotification,
    onLoadNotifications,
    onToggleSidebar
}) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const currentAccount = useCurrentAccount();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Load notifications when notification panel opens
    const handleNotificationClick = async () => {
        if (!isNotificationsOpen && currentAccount?.address) {
            setIsLoadingNotifications(true);
            try {
                await onLoadNotifications();
            } finally {
                setIsLoadingNotifications(false);
            }
        }
        setIsNotificationsOpen(prev => !prev);
    };

    return (
        <header className="flex-shrink-0 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 border-b border-border bg-background/50 backdrop-blur-sm z-20">
            <div className="flex items-center">
                {/* Hamburger menu for mobile */}
                <button 
                    onClick={onToggleSidebar}
                    className="lg:hidden mr-3 p-2 rounded-lg hover:bg-surface transition-colors"
                    aria-label="Toggle menu"
                >
                    <MenuIcon className="w-6 h-6 text-primary" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-heading">Dashboard</h1>
                    <p style={{ fontFamily: "helvetica" }} className="text-secondary text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">Welcome back, {username}!</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Search - hidden on mobile, visible on larger screens */}
                <div className="hidden sm:relative sm:w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input
                        type="text"
                        style={{ fontFamily: "helvetica" }}
                        placeholder="Search quests..."
                        className="w-full bg-surface border border-transparent hover:border-border focus:border-accent focus:ring-accent/50 rounded-lg pl-10 pr-4 py-2 transition-colors duration-300 focus:outline-none"
                    />
                </div>
                
                <div ref={notificationRef} className="relative">
                    <Tooltip content="Notifications" position="bottom">
                        <button 
                            onClick={handleNotificationClick} 
                            className="relative p-2 rounded-full hover:bg-surface transition-colors" 
                            aria-label="Notifications"
                            disabled={isLoadingNotifications}
                        >
                            <BellIcon className={`w-6 h-6 text-secondary ${isLoadingNotifications ? 'animate-pulse' : ''}`} />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 min-w-[1rem] h-4 px-1 text-xs font-bold text-primary bg-red-500 rounded-full flex items-center justify-center border-2 border-background">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                    </Tooltip>
                    {isNotificationsOpen && (
                        <NotificationPanel
                            notifications={notifications}
                            onClearAll={onClearNotifications}
                            onDeleteNotification={onDeleteNotification}
                            isLoading={isLoadingNotifications}
                        />
                    )}
                </div>
                
                <div className="h-8 w-px bg-border hidden sm:block"></div>
                
                <Tooltip content="Profile & Settings" position="bottom">
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" data-hover>
                        <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${username}`} alt="User Avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-accent transition-all duration-300" />
                        {/* Hide username on mobile */}
                        <div className="hidden sm:block">
                            <p className="text-sm sm:text-base font-bold font-heading text-primary">@{username}</p>
                            <p style={{ fontFamily: "helvetica" }} className="text-xs text-secondary">Chain Champion</p>
                        </div>
                        <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary group-hover:text-primary transition-colors hidden sm:block" />
                    </div>
                </Tooltip>
            </div>
        </header>
    );
};

export default DashboardHeader;