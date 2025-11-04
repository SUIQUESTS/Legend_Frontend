import React from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import AchievementCard from './AchievementCard';

const achievementsData = [
    {
        id: 1,
        title: "Sui Shadow Master",
        description: "For mastering advanced Sui SDK techniques and completing the 'Deploy a Smart Contract' quest.",
        image: "https://picsum.photos/seed/shadowmaster/500/700",
        dateEarned: "2023-10-26",
    },
    {
        id: 2,
        title: "Lord of SUIterfell",
        description: "Awarded for achieving the #1 rank on the leaderboard for a full season.",
        image: "https://picsum.photos/seed/suiterfell/500/700",
        dateEarned: "2023-09-15",
    },
    {
        id: 3,
        title: "SUIdow Legend",
        description: "For uncovering and responsibly reporting a critical vulnerability.",
        image: "https://picsum.photos/seed/suidow/500/700",
        dateEarned: "2023-08-01",
    },
    {
        id: 4,
        title: "Meme-N-SUI-A",
        description: "For creating a meme that reached over 1 million impressions on social media.",
        image: "https://picsum.photos/seed/memensia/500/700",
        dateEarned: "2023-11-05",
    },
    {
        id: 5,
        title: "Artifex Maximus",
        description: "Bestowed upon the winner of the 'Design a Legendary NFT' art competition.",
        image: "https://picsum.photos/seed/artifex/500/700",
        dateEarned: "2023-10-18",
    },
    {
        id: 6,
        title: "The Oracle",
        description: "For writing a comprehensive Sui tutorial that became the community's top-rated guide.",
        image: "https://picsum.photos/seed/oracle/500/700",
        dateEarned: "2023-09-30",
    }
];


const AchievementsPage: React.FC = () => {
    // Fix: Changed HTMLElement to HTMLDivElement to match the element type the ref is attached to, resolving the TypeScript error.
    const [sectionRef, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });

    return (
        <div style={{ fontFamily: "helvetica" }} ref={sectionRef} className="p-8 space-y-10 animate-content-fade-in">
            <header>
                <h1 className="text-4xl font-bold font-heading text-primary">Hall of Achievements</h1>
                <p className="mt-2 text-secondary max-w-2xl">A collection of your earned NFT badges, immortalized on the blockchain. Your legend is written here.</p>
            </header>

            <section>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {achievementsData.map((achievement, index) => (
                        <AchievementCard key={achievement.id} achievement={achievement} index={index} isVisible={isVisible} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AchievementsPage;