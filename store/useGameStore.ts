import { create } from 'zustand';
import { GamePhase, Player, Question } from '@/types/game';

interface GameStore {
  gameState: GamePhase;
  currentQuestion: Question | null;
  players: Player[];
  lockedBy: string | null;
  syncWithServer: (data: any) => void;
  handleBuzzAccepted: (playerId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'IDLE',
  currentQuestion: null,
  players: [],
  lockedBy: null,

  // Method to update everything at once from the server
  // TODO: Fix the types
  syncWithServer: (data: any) =>
    set({
      gameState: data.phase,
      currentQuestion: data.question,
      players: data.players,
      lockedBy: data.lockedBy,
    }),

  // Partial updates for speed (e.g., someone buzzed)
  handleBuzzAccepted: (playerId: string) =>
    set({
      gameState: 'TYPING',
      lockedBy: playerId,
    }),
}));
