import useFetch from "./useFetch";

interface RecentMistake {
  id: number;
  mistake: string;
  correction: string;
}

interface StatsData {
  streak: number;
  dailyGoal: { completed: number; total: number };
  totalWords: number;
  pendingMistakes: number;
  recentMistakes: RecentMistake[];
}

export const useStats = () => {
  const { data, loading, error } = useFetch<StatsData>('stats');

  return {
    ...data,
    loading,
    error,
  };
};
