import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon } from '../icons';
import Tooltip from '../Tooltip';
import NotificationPanel from './NotificationPanel';
import { Notification } from './DashboardLayout';

interface DashboardHeaderProps {
    username: string;
    notifications: Notification[];
    onClearNotifications: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username, notifications, onClearNotifications }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

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

    return (
        <header className="flex-shrink-0 h-20 flex items-center justify-between px-8 border-b border-border bg-background/50 backdrop-blur-sm z-20">
            <div>
                <h1 className="text-2xl font-bold font-heading">Dashboard</h1>
                <p style={{ fontFamily: "helvetica" }} className="text-secondary text-sm">Welcome back, {username}!</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-64">
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
                            onClick={() => setIsNotificationsOpen(prev => !prev)} 
                            className="relative p-2 rounded-full hover:bg-surface transition-colors" 
                            aria-label="Notifications"
                        >
                            <BellIcon className="w-6 h-6 text-secondary" />
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
                        />
                    )}
                </div>
                <div className="h-8 w-px bg-border"></div>
                <Tooltip content="Profile & Settings" position="bottom">
                    <div className="flex items-center gap-3 cursor-pointer group" data-hover>
                        <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=${username}`} alt="User Avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-accent transition-all duration-300" />
                        <div>
                            <p className="text-1xl font-bold font-heading text-primary">@{username}</p>
                            <p style={{ fontFamily: "helvetica" }} className="text-xs text-secondary">Chain Champion</p>
                        </div>
                        <ChevronDownIcon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                    </div>
                </Tooltip>
            </div>
        </header>
    );
};

export default DashboardHeader;