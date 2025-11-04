import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import LiveQuestsSection from './LiveQuestsSection';
import HallOfFameSection from './HallOfFameSection';
import LeaderboardSection from './LeaderboardSection';
import Footer from './Footer';

interface UserData {
  id: string;
  walletAddress: string;
  name: string;
  score: number;
}

interface LandingPageProps {
  onEnter: () => void;
  onNavigateToProfile: () => void;
  onNavigateToDashboard: (userData: UserData) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onEnter, 
  onNavigateToProfile, 
  onNavigateToDashboard 
}) => {
  return (
    <>
      <Header 
        onEnter={onEnter} 
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToDashboard={onNavigateToDashboard}
      />
      <main>
        <HeroSection 
          onEnter={onEnter} 
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToDashboard={onNavigateToDashboard}
        />
        <HowItWorksSection />
        <LiveQuestsSection />
        <HallOfFameSection />
        <LeaderboardSection />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;