import { create } from 'zustand';
import { Game, GameState, Player, SyncStatePayload } from '@/types/game';

const initialState: Game = {
  roomId: '',
  gameState: 'WAITING',
  totalCategories: 0,
  currentQuestion: null,
  questionIndex: 0,
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
  handleBuzzAccepted: (playerId: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  syncRoom: (data: SyncStatePayload) => set({ ...data }),

  setGameState: (gameState: GameState) => set({ gameState }),

  setLockedBy: (lockedBy: string | null) => set({ lockedBy }),

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

  reset: () => set(initialState),
}));
