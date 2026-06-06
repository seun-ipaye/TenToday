import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '@/types';

const STORAGE_KEY = 'tentoday_goals';

// Returns today as YYYY-MM-DD in local time
export function todayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hasCompletedToday(goal: Goal): boolean {
  return goal.completedDates.includes(todayKey());
}

// Counts consecutive days ending at today (if completed today) or yesterday (if not).
export function computeStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const today = todayKey();

  // Streak must start from today or yesterday
  if (sorted[0] !== today && sorted[0] !== prevDay(today)) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prevDay(sorted[i - 1])) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function prevDay(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export async function loadGoals(): Promise<Goal[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Goal[];
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export async function addGoal(name: string): Promise<Goal[]> {
  const goals = await loadGoals();
  const newGoal: Goal = {
    id: String(Date.now()),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    completedDates: [],
  };
  const updated = [...goals, newGoal];
  await saveGoals(updated);
  return updated;
}

export async function completeSession(goalId: string): Promise<Goal[]> {
  const goals = await loadGoals();
  const updated = goals.map((g) =>
    g.id === goalId && !g.completedDates.includes(todayKey())
      ? { ...g, completedDates: [...g.completedDates, todayKey()] }
      : g
  );
  await saveGoals(updated);
  return updated;
}
