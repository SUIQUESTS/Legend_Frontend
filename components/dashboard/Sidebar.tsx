import React from 'react';
import { SuiLogo, HomeIcon, LayoutGridIcon, AwardIcon, UsersIcon, SettingsIcon, LogoutIcon, PlusCircleIcon, ClipboardDocumentCheckIcon } from '../icons';
import Tooltip from '../Tooltip';
import { useDisconnectWallet } from '@mysten/dapp-kit';

interface NavItemProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <Tooltip content={label} position="right" className="w-full">
        <button
            style={{ fontFamily: "helvetica" }}
            onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                onClick();
            }}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-300 group relative ${
                isActive
                    ? 'text-primary bg-accent/10'
                    : 'text-secondary hover:text-primary hover:bg-surface'
            }`}
        >
            <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-accent transition-transform duration-300 ease-out ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
            <div className="relative ml-2">
                {React.cloneElement(icon, { className: `w-6 h-6 transition-colors ${isActive ? 'text-accent' : ''}` })}
            </div>
            <span className="ml-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">{label}</span>
        </button>
    </Tooltip>
);

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
      const { mutateAsync: disconnect } = useDisconnectWallet();
    const navItems = [
        { id: 'Home', icon: <HomeIcon />, label: 'Home' },
        { id: 'Quests', icon: <LayoutGridIcon />, label: 'Quests' },
        { id: 'Create Quest', icon: <PlusCircleIcon />, label: 'Create Quest' },
        { id: 'My Quests', icon: <ClipboardDocumentCheckIcon />, label: 'My Quests' },
        { id: 'Achievements', icon: <AwardIcon />, label: 'Achievements' },
        { id: 'Leaderboard', icon: <UsersIcon />, label: 'Leaderboard' },
    ];

    const handleLogout = async () => {
        await disconnect();
        onLogout();
    };

    return (
        <aside className="fixed top-0 left-0 h-full w-20 hover:w-64 transition-all duration-300 ease-in-out bg-surface-dark/80 backdrop-blur-lg border-r border-border z-30 flex flex-col p-4 overflow-hidden group">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-12 flex-shrink-0 pl-1.5 h-8">
                <SuiLogo className="w-8 h-8 text-lp-accent-soft flex-shrink-0"/>
                <span className="opacity-0 group-hover:opacity-100 text-2xl md:text-2xl font-bold font-heading text-primary uppercase whitespace-nowrap">LEGENDS</span>
            </div>
            
            <nav className="flex-1 space-y-3">
                {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activePage === item.id}
                        onClick={() => setActivePage(item.id)}
                    />
                ))}
            </nav>

            <div className="mt-auto flex-shrink-0 space-y-3">
                <NavItem
                    icon={<SettingsIcon />}
                    label="Settings"
                    isActive={activePage === 'Settings'}
                    onClick={() => setActivePage('Settings')}
                />
                

                {/* Option 2: Custom logout button that clears storage */}
                <Tooltip content="Logout & Clear Data" position="right" className="w-full">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-300 group relative text-secondary hover:text-red-400 hover:bg-red-500/10"
                        aria-label="Logout"
                    >
                        <div className="relative ml-2">
                            <LogoutIcon className="w-6 h-6" />
                        </div>
                        <span style={{ fontFamily: "helvetica" }} className="ml-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">
                            Logout
                        </span>
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
};

export default Sidebar;