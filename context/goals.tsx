import React, { createContext, useContext, useEffect, useState } from 'react';
import { Goal } from '@/types';
import * as GoalStore from '@/store/goals';

type GoalContextType = {
  goals: Goal[];
  loading: boolean;
  refresh: () => Promise<void>;
  addGoal: (name: string) => Promise<void>;
  completeSession: (goalId: string) => Promise<void>;
};

const GoalContext = createContext<GoalContextType | null>(null);

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const loaded = await GoalStore.loadGoals();
    setGoals(loaded);
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  const addGoal = async (name: string) => {
    const updated = await GoalStore.addGoal(name);
    setGoals(updated);
  };

  const completeSession = async (goalId: string) => {
    const updated = await GoalStore.completeSession(goalId);
    setGoals(updated);
  };

  return (
    <GoalContext.Provider value={{ goals, loading, refresh, addGoal, completeSession }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals(): GoalContextType {
  const ctx = useContext(GoalContext);
  if (!ctx) throw new Error('useGoals must be used within GoalProvider');
  return ctx;
}
