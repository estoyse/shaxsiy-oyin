// The 5-level difficulty system
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

// The distinct phases of the game loop
export type GameState =
  | 'WAITING'
  | 'SCRAMBLE'
  | 'ANSWERING'
  | 'RESET_SCRAMBLE'
  | 'GRADING'
  | 'REVEAL'
  | 'ENDED';

export type GameEventType =
  | 'JOIN_ROOM'
  | 'CREATE_ROOM'
  | 'ROOM_CREATED'
  | 'PLAYER_JOINED'
  | 'GAME_START'
  | 'QUESTION_START'
  | 'BUZZ'
  | 'BUZZ_ACCEPTED'
  | 'BUZZ_REJECTED'
  | 'ANSWER_SUBMIT'
  | 'ANSWER_RESULT'
  | 'SCORE_UPDATE'
  | 'RESET_SCRAMBLE'
  | 'GAME_END'
  | 'ROOM_SYNC'
  | 'ERROR';

export interface Player {
  id: string;
  name: string;
  score: number;
  strikes: number;
  isBannedFromQuestion: boolean;
  isConnected: boolean;
  socketId?: string; // For internal mapping
  avatar?: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  difficulty: number;
  scrambleEndTime: number;
  questionIndex: number;
}

export interface Game {
  // Config/Metadata
  roomId: string;
  isPrivate: boolean;
  hasPassword: boolean;
  maxPlayers: number;
  categoriesCount: number;
  // Game State
  gameState: GameState;
  currentQuestion: Question | null;
  totalQuestions: number;
  expiresAt: string | null; // ISO Timestamp
  scrambleEndTime: number | null; // Server timestamp
  buzzTimestamp: number | null; // Server timestamp
  serverTime: number; // Last known server time
  serverTimeOffset: number; // clientTime - serverTime
  // Logic State
  lockedBy: string | null; // Player ID who hit the buzzer (answeringPlayerId)
  revealEndTime: number | null; // Timestamp when REVEAL phase ends

  players: Player[];
  hostId: string;
  answers: GivenAnswer[];
  strikes: number;
}

export interface SyncStatePayload {
  roomId: string;
  gameState: GameState;
  currentQuestion: Question | undefined;
  questionIndex: number;
  players: Player[];
  lockedBy: string;
  buzzTimestamp: number | null;
  scrambleEndTime: number | null;
  serverTime: number;
  // Config
  maxPlayers: number;
  isPrivate: boolean;
  categoriesCount: number;
  hasPassword: boolean;
}

export interface JoinRoomPayload {
  roomId: string;
  token: string; // JWT
  password?: string;
}

export interface CreateRoomPayload {
  token: string;
  categoriesCount: number;
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
}

export interface RoomCreatedPayload {
  roomId: string;
}

export interface BuzzPayload {
  timestamp: number; // Client timestamp (for reference, not trust)
}

export interface AnswerPayload {
  text: string;
}

export interface AnswerResultPayload {
  correct: boolean;
  playerId: string;
  newScore: number;
  previousScore: number;
  strikes: number;
  answers: GivenAnswer[];
  reason: 'STRIKE_LIMIT' | 'CORRECT_ANSWER' | 'WRONG_ANSWER' | 'TIMEOUT';
  correctAnswer?: string;
  revealDuration?: number; // ms to show the answer
}

export interface QuestionStartPayload {
  questionId: string;
  text: string;
  category?: string;
  scrambleDuration: number;
}

export interface GivenAnswer {
  playerId: string;
  playerName: string;
  text: string;
  correct: boolean;
  timestamp: number;
}
