export type Goal = {
  id: string;
  name: string;
  createdAt: string;
  // Each entry is a YYYY-MM-DD date string for a completed session day
  completedDates: string[];
  // Partial progress for the current day
  partialSeconds?: number;
  partialDate?: string; // YYYY-MM-DD
};
