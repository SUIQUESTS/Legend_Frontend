export interface ApiChallenge {
  _id: string;
  creator: string;
  title: string;
  description: string;
  participant_limit: number;
  nft_id: string;
  deadline: string;
  status: string;
  submissions: Array<{
    participant_address: string;
    submission_link: string;
    submittedAt: string;
  }>;
  winner?: string;
  rewardPoints: number;
  dateCreated: string;
}

export interface ChallengesResponse {
  message: string;
  walletAddress: string;
  won: ApiChallenge[];
  active: ApiChallenge[];
}

export const fetchUserChallenges = async (walletAddress: string): Promise<ChallengesResponse> => {
  const response = await fetch(
    `https://legendbackend-a29sm.sevalla.app/api/challenges/creator/${walletAddress}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch challenges');
  }
  
  return response.json();
};