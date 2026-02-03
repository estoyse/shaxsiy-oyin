// The 5-level difficulty system
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

// The distinct phases of the game loop
export type GamePhase = 'IDLE' | 'SCRAMBLE' | 'TYPING' | 'RESULT_ANIMATION' | 'GAME_OVER';

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  currentElo?: number;
  currentGameScore: number;
  hasGuessedWrong: boolean; // Used to disable their buzzer for the current question
  isReady: boolean;
}

export interface Question {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  // Answer is kept on server, but we need the length or mask for the UI
  answerLength: number;
}

export interface GameState {
  // Metadata
  roomId: string;
  phase: GamePhase;
  totalSubjects: number;
  currentSubjectIndex: number;
  currentQuestionIndex: number; // 1 to 50

  // Active Question Data
  currentQuestion: Question | null;
  expiresAt: string; // ISO Timestamp - The "Single Source of Truth" for timers

  // Logic State
  lockedBy: string | null; // Player ID who hit the buzzer
  wrongAnswersInRoom: number; // Counter for the "3-strike" skip rule
  lastGuess: {
    playerId: string;
    text: string;
    isCorrect: boolean;
  } | null;

  // Player Data
  players: Player[];
  hostId: string;
}
