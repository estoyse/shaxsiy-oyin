import { create } from 'zustand';
import { Game, GameState, Player, Question, SyncStatePayload } from '@/types/game';

const initialState: Game = {
  roomId: '',
  gameState: 'WAITING',
  categoriesCount: 0,
  currentQuestion: null,
  totalQuestions: 0,
  expiresAt: null,
  scrambleEndTime: null,
  buzzTimestamp: null,
  serverTime: 0,
  serverTimeOffset: 0,
  lockedBy: null,
  wrongAnswersInRoom: 0,
  lastGuess: null,
  players: [],
  hostId: '',
  maxPlayers: 0,
  isPrivate: false,
  hasPassword: false,
};

interface GameStore extends Game {
  syncRoom: (data: SyncStatePayload) => void;
  setGameState: (state: GameState) => void;
  setLockedBy: (playerId: string | null) => void;
  updatePlayers: (player: Player) => void;
  setQuestion: (question: Question) => void;
  handleBuzzAccepted: (playerId: string) => void;
  setScrambleTime: (scrambleEndTime: number) => void;
  setStrikes: (strikes: number) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  syncRoom: (data: SyncStatePayload) =>
    set({
      ...data,
      serverTimeOffset: data.serverTime - Date.now(),
    }),

  setGameState: (gameState: GameState) => set({ gameState }),

  setLockedBy: (lockedBy: string | null) => set({ lockedBy }),
  setStrikes: (strikes: number) => set({ wrongAnswersInRoom: strikes }),

  setQuestion: (question: Question) =>
    set({ currentQuestion: question, scrambleEndTime: question.scrambleEndTime }),

  updatePlayers: (player: Player) =>
    set((state) => {
      const existingPlayer = state.players.find((p) => p.id === player.id);
      if (existingPlayer) {
        return {
          players: state.players.map((p) => (p.id === player.id ? player : p)),
        };
      } else {
        return { players: [...state.players, player] };
      }
    }),

  handleBuzzAccepted: (playerId: string) =>
    set({
      gameState: 'ANSWERING',
      lockedBy: playerId,
    }),

  setScrambleTime: (scrambleEndTime: number) => set({ scrambleEndTime }),

  updatePlayerScore: (playerId: string, score: number) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, score } : p)),
    })),

  reset: () => set(initialState),
}));
