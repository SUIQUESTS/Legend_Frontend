import React, { useState, useEffect } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { CrownIcon } from './icons';
import axios from 'axios';

interface LeaderboardEntry {
  userAddress: string;
  totalPoints: number;
  name: string;
}

interface LeaderboardResponse {
  message: string;
  data: LeaderboardEntry[];
}

const LeaderboardRow: React.FC<{ 
  data: LeaderboardEntry; 
  index: number;
  rank: number;
}> = ({ data, index, rank }) => {
  const [ref, isVisible] = useOnScreen<HTMLTableRowElement>({ threshold: 0.2, triggerOnce: true });
  
  const rankStyles: { [key: number]: string } = {
    1: "bg-amber-400/10 text-amber-300 border-l-4 border-amber-400",
    2: "bg-slate-300/10 text-slate-200 border-l-4 border-slate-300",
    3: "bg-orange-400/10 text-orange-300 border-l-4 border-orange-400",
  };

  const isTop3 = rank <= 3;

  // Generate avatar URL based on user address
  const generateAvatarUrl = (address: string) => {
    return `https://api.dicebear.com/8.x/bottts/svg?seed=${address}`;
  };

  // Format user address for display
  const formatUser = (address: string, name?: string) => {
    if (name) return `@${name}`;
    return `@${address.slice(0, 8)}...`;
  };

  return (
    <tr
      ref={ref}
      className={`border-b border-border group transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${isTop3 ? rankStyles[rank] : 'hover:bg-surface'}`}
      style={{ transform: isVisible ? 'none' : 'translateX(30px)', transitionDelay: `${index * 80}ms` }}
    >
      <td className="p-3 sm:p-4 text-center font-bold font-heading text-lg">
        {isTop3 ? <CrownIcon className="w-5 sm:w-6 h-5 sm:h-6 mx-auto" /> : rank}
      </td>
      <td className="p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <img 
            src={generateAvatarUrl(data.userAddress)} 
            alt={data.userAddress} 
            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-surface group-hover:ring-accent transition-all" 
          />
          <div>
            <span className="font-semibold text-primary block text-sm sm:text-base">{formatUser(data.userAddress, data.name)}</span>
            <span className="text-xs text-secondary">{data.userAddress.slice(0, 6)}...</span>
          </div>
        </div>
      </td>
      <td className="p-3 sm:p-4 text-center text-secondary group-hover:text-primary transition-colors text-sm sm:text-base">
        {/* Since the API doesn't provide quest count, show placeholder */}
        -
      </td>
      <td className="p-3 sm:p-4 text-center font-bold font-heading text-lg text-accent-soft">
        {data.totalPoints.toLocaleString()}
      </td>
    </tr>
  );
};

const LeaderboardSection: React.FC = () => {
  const [titleRef, isTitleVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data from API
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get<LeaderboardResponse>(
          'https://legendbackend-a29sm.sevalla.app/api/challenges/leaderboard'
        );

        console.log("Leaderboard API response:", response.data);

        if (response.data && response.data.data) {
          // Take only the top 6 users, or all if less than 6
          const topSix = response.data.data.slice(0, 6);
          console.log("Top 6 users:", topSix);
          setLeaderboardData(topSix);
        } else {
          console.log("No data found in response");
          setLeaderboardData([]);
        }
      } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
        setError('Failed to load leaderboard data');
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <section id="leaderboard" className="py-16 sm:py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div 
          ref={titleRef} 
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-primary uppercase">Top Champions</h2>
          <p style={{ fontFamily: "helvetica" }} className="mt-4 text-base sm:text-lg text-secondary max-w-2xl mx-auto">
            The mightiest legends leading the charge. Will you join them?
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-secondary">Loading top champions...</p>
          </div>
        ) : error && leaderboardData.length === 0 ? (
          <div className="text-center py-12 px-6 bg-surface rounded-lg border border-border border-dashed">
            <CrownIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
            <h3 className="text-2xl font-bold font-heading text-primary mb-4">Unable to Load Leaderboard</h3>
            <p className="text-secondary max-w-md mx-auto">{error}</p>
          </div>
        ) : (
          <div style={{ fontFamily: "helvetica" }} className="bg-surface backdrop-blur-md border border-border rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b-2 border-border">
                <tr>
                  <th className="p-3 sm:p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center w-1/6">Rank</th>
                  <th className="p-3 sm:p-4 text-left text-secondary font-semibold uppercase tracking-wider w-1/2">User</th>
                  <th className="p-3 sm:p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Quests</th>
                  <th className="p-3 sm:p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((row, index) => (
                    <LeaderboardRow 
                      key={row.userAddress} 
                      data={row} 
                      index={index}
                      rank={index + 1}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-secondary">
                      No champions yet. Be the first to earn points!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Show message if there are fewer than 6 users */}
            {leaderboardData.length > 0 && leaderboardData.length < 6 && (
              <div className="p-4 text-center text-sm text-secondary bg-background/50 border-t border-border">
                Showing all {leaderboardData.length} champion{leaderboardData.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeaderboardSection;