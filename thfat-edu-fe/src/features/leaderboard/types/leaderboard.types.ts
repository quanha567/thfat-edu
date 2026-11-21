export type TTimeframe = "this_week" | "this_month" | "all_time";

export type TLeaderboardItem = {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  gender?: "male" | "female" | "other" | null;
  schoolName: string | null;
  totalScore: number;
  totalExams: number;
  totalDurationSeconds: number;
};

export type TLeaderboardResponse = {
  items: TLeaderboardItem[];
  total: number;
  page: number;
  limit: number;
  myRank: TLeaderboardItem | null;
};

export type TLeaderboardParams = {
  tab?: "global" | "quiz";
  quizId?: string;
  timeframe?: TTimeframe;
  page?: number;
  limit?: number;
};
