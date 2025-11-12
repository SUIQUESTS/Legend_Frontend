import React, { useState, useEffect } from 'react';
import { SuiLogo, MenuIcon, XIcon } from './icons';
import { WalletConnection } from './WalletConnection';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void, isMobile?: boolean }> = ({ href, children, onClick, isMobile = false }) => (
    <a 
      href={href} 
      onClick={onClick}
      className={`transition-colors duration-300 font-medium relative group ${isMobile ? 'text-2xl py-2' : 'text-secondary hover:text-primary'}`}
    >
        {children}
        {!isMobile && <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>}
    </a>
);

interface UserData {
  id: string;
  walletAddress: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface HeaderProps {
  onEnter: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToDashboard?: (userData: UserData) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onEnter, 
  onNavigateToProfile = () => {}, 
  onNavigateToDashboard = () => {} 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleEnterClick = () => {
    closeMenu();
    onEnter();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-sm border-b border-border' : 'bg-transparent border-b border-transparent'}`}>
        <div className={`container mx-auto px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
          <a href="#hero" className="flex items-center gap-2 text-2xl font-bold text-primary" onClick={closeMenu}>
            <SuiLogo className="w-6 h-6 text-accent-soft"/>
            <span className="text-2xl md:text-2xl font-bold font-heading text-primary uppercase">LEGENDS</span>
          </a>
          <nav style={{ fontFamily: "helvetica" }} className="hidden md:flex items-center gap-8">
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#quests">Live Quests</NavLink>
              <NavLink href="#hall-of-fame">Hall of Fame</NavLink>
              <NavLink href="#leaderboard">Leaderboard</NavLink>
          </nav>
          <div className="hidden md:flex items-center">
            <WalletConnection 
              onNavigateToProfile={onNavigateToProfile}
              onNavigateToDashboard={onNavigateToDashboard}
            />
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary z-50 relative" aria-label="Toggle menu">
              {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Panel */}
      <div style={{ fontFamily: "helvetica" }} className={`fixed inset-0 bg-background/95 backdrop-blur-lg z-40 transform transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-6 h-full flex flex-col items-center justify-center text-primary">
          <nav className="flex flex-col items-center gap-8 text-center">
            <NavLink href="#how-it-works" onClick={closeMenu} isMobile>How It Works</NavLink>
            <NavLink href="#quests" onClick={closeMenu} isMobile>Live Quests</NavLink>
            <NavLink href="#hall-of-fame" onClick={closeMenu} isMobile>Hall of Fame</NavLink>
            <NavLink href="#leaderboard" onClick={closeMenu} isMobile>Leaderboard</NavLink>
          </nav>
          <div className="mt-12">
            <button
                onClick={handleEnterClick}
                className="relative overflow-hidden font-semibold text-xl px-10 py-4 bg-lp-accent-soft text-background rounded-lg hover:bg-lp-accent focus:outline-none focus:ring-4 focus:ring-lp-accent-soft/50 transition-all duration-300 transform hover:scale-105 bg-[#00f5ff]"
            >
                <span className="relative z-10">Enter Arena</span>
                <span className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;