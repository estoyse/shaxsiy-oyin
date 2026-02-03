import { DifficultyLevel } from '@/types/game';

export const calculatePoints = (difficulty: DifficultyLevel, isCorrect: boolean) => {
  if (isCorrect) {
    return difficulty * 10; // e.g., Diff 5 = +50
  }
  return -(difficulty * 5); // e.g., Diff 5 = -25
};

export const getTimerRemaining = (expiresAt: string): number => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 1000));
};
