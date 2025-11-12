import React, { useState, useEffect } from 'react';
import { CrownIcon } from '../icons';
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
  rank: number;
}> = ({ data, rank }) => {
  
  const rankStyles: { [key: number]: string } = {
    1: "bg-accent/20 text-accent border-l-4 border-accent",
    2: "bg-primary/10 text-primary border-l-4 border-primary/50",
    3: "bg-secondary/10 text-secondary border-l-4 border-secondary/50",
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
      className={`border-b border-border group transition-all duration-300 ease-out hover:bg-surface/50 ${isTop3 ? rankStyles[rank] : ''}`}
    >
      <td className="p-4 text-center font-bold font-heading text-lg">
        {isTop3 ? <CrownIcon className={`w-6 h-6 mx-auto ${rank === 1 ? 'text-accent' : 'text-current'}`} /> : rank}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <img 
            src={generateAvatarUrl(data.userAddress)} 
            alt={data.userAddress} 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-surface group-hover:ring-accent transition-all" 
          />
          <div>
            <span className="font-semibold text-primary block">{formatUser(data.userAddress, data.name)}</span>
            <span className="text-xs text-secondary">{data.userAddress.slice(0, 8)}...</span>
          </div>
        </div>
      </td>
      <td className="p-4 text-center text-secondary group-hover:text-primary transition-colors">
        {/* Since the API doesn't provide quest count, we can show a placeholder or calculate if possible */}
        -
      </td>
      <td className="p-4 text-center font-bold font-heading text-lg text-accent">
        {data.totalPoints.toLocaleString()}
      </td>
    </tr>
  );
};

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data from API
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setIsLoading(true);
        setError(null);
        
        // console.log("Starting to fetch leaderboard...");
        
        const response = await axios.get<LeaderboardResponse>(
          'https://legendbackend-a29sm.sevalla.app/api/challenges/leaderboard'
        );

        // console.log("Full API response:", response);
        // console.log("Response data:", response.data);
        // console.log("Leaderboard entries:", response.data.data);

        if (response.data && response.data.data) {
          // console.log("Setting leaderboard data:", response.data.data);
          setLeaderboardData(response.data.data);
        } else {
          console.log("No data found in response");
          setLeaderboardData([]);
        }
      } catch (error: any) {
        // console.error("Error fetching leaderboard:", error);
        // console.error("Error details:", error.response?.data);
        setError('Failed to load leaderboard data');
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div style={{ fontFamily: "helvetica" }} className="p-8 space-y-10 animate-content-fade-in">
        <header>
          <h1 className="text-4xl font-bold font-heading text-primary">Leaderboard</h1>
          <p className="mt-2 text-secondary max-w-2xl">See where you stand among the legends. Climb the ranks by completing quests and earning points.</p>
        </header>

        <section>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-secondary">Loading leaderboard...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error && leaderboardData.length === 0) {
    return (
      <div style={{ fontFamily: "helvetica" }} className="p-8 space-y-10 animate-content-fade-in">
        <header>
          <h1 className="text-4xl font-bold font-heading text-primary">Leaderboard</h1>
          <p className="mt-2 text-secondary max-w-2xl">See where you stand among the legends. Climb the ranks by completing quests and earning points.</p>
        </header>

        <section>
          <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
            <CrownIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
            <h3 className="text-2xl font-bold font-heading text-primary mb-4">Error Loading Leaderboard</h3>
            <p className="text-secondary max-w-md mx-auto mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="group relative font-semibold text-primary px-8 py-3 bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-accent"
            >
              Try Again
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "helvetica" }} className="p-8 space-y-10 animate-content-fade-in">
      <header>
        <h1 className="text-4xl font-bold font-heading text-primary">Leaderboard</h1>
        <p className="mt-2 text-secondary max-w-2xl">
          See where you stand among the legends. Climb the ranks by completing quests and earning points.
          {leaderboardData.length > 0 && ` (${leaderboardData.length} users)`}
        </p>
      </header>

      <section>
        {leaderboardData.length > 0 ? (
          <div className="bg-surface backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b-2 border-border bg-background/30">
                <tr>
                  <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center w-[10%]">Rank</th>
                  <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider w-[50%]">User</th>
                  <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Quests</th>
                  <th className="p-4 text-left text-secondary font-semibold uppercase tracking-wider text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((row, index) => (
                  <LeaderboardRow 
                    key={row.userAddress} 
                    data={row} 
                    rank={index + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border border-dashed">
            <CrownIcon className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
            <h3 className="text-2xl font-bold font-heading text-primary mb-4">No Leaderboard Data</h3>
            <p className="text-secondary max-w-md mx-auto mb-8">
              The leaderboard is currently empty. Be the first to complete quests and earn points to appear here!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LeaderboardPage;