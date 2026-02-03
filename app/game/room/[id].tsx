import ButtonContainer from '@/components/game/buzzerButton';
import HeaderComponent from '@/components/game/header';
import LiveStandings from '@/components/game/liveStandings';
import QuestionComponent from '@/components/game/question';
import SafeArea from '@/components/safeArea';
import { getSocket } from '@/services/socket';
import { useGameStore } from '@/store/useGameStore';
import { GameState, Player } from '@/types/game';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

const players: Player[] = [
  {
    id: 'me',
    name: 'You',
    currentGameScore: 1450,
    avatarUrl: 'https://picsum.photos/seed/user1/40/40',
    isReady: true,
    hasGuessedWrong: false,
  },
  {
    id: '2',
    name: 'Sarah K.',
    currentGameScore: 1200,
    avatarUrl: 'https://picsum.photos/seed/user2/40/40',
    isReady: false,
    hasGuessedWrong: false,
  },
  {
    id: '3',
    name: 'Mike R.',
    currentGameScore: 980,
    avatarUrl: 'https://picsum.photos/seed/user3/40/40',
    isReady: false,
    hasGuessedWrong: false,
  },
  {
    id: '4',
    name: 'Elena T.',
    currentGameScore: 850,
    avatarUrl: 'https://picsum.photos/seed/user4/40/40',
    isReady: false,
    hasGuessedWrong: false,
  },
];

export const MOCK_GAME_STATE: GameState = {
  roomId: '777-BINGO',
  phase: 'TYPING',
  totalSubjects: 10,
  currentSubjectIndex: 1,
  currentQuestionIndex: 3,

  currentQuestion: {
    id: 'q_123',
    text: 'What is the capital of Japan?',
    difficulty: 3,
    answerLength: 5,
  },

  // Set this to 30 seconds from "now" for your countdown component
  expiresAt: new Date(Date.now() + 30000).toISOString(),

  lockedBy: 'player_3',
  wrongAnswersInRoom: 1,

  lastGuess: {
    playerId: 'player_2',
    text: 'KYOTO',
    isCorrect: false,
  },

  players,
  hostId: 'me',
};

export default function RoomPage() {
  const { id } = useLocalSearchParams();
  const syncWithServer = useGameStore((state) => state.syncWithServer);
  const handleBuzzAccepted = useGameStore((state) => state.handleBuzzAccepted);
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    let socket: any;

    const init = async () => {
      const s = await getSocket();
      socket = s;
      const myId = 'me'; // Replace with actual user ID from auth when ready

      // 1. Initial Sync
      s.on('ROOM_SYNC', (data) => {
        syncWithServer(data);
        console.log(data);
      });

      // 2. Question Start
      s.on('QUESTION_START', (data) => {
        syncWithServer(data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });

      // 3. Buzzer Result
      s.on('BUZZ_ACCEPTED', (payload) => {
        handleBuzzAccepted(payload.playerId);
        if (payload.playerId === myId) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      });

      // 4. Correct/Wrong Answer
      s.on('ANSWER_RESULT', ({ isCorrect, score, playerId }) => {
        // Show a quick animation or toast
        if (isCorrect) {
          toast.success('Correct Answer!');
        } else {
          toast.error('Wrong Answer!');
        }
      });

      s.connect();
    };

    init();
    return () => socket?.disconnect();
  }, [syncWithServer, handleBuzzAccepted]);

  return (
    <View className="bg-background flex-1">
      <SafeArea edges={['top']}>
        <View className="flex-1">
          <HeaderComponent />
          <QuestionComponent answering={answering} />
          <ButtonContainer answering={answering} setAnswering={setAnswering} players={players} />
        </View>
      </SafeArea>

      <LiveStandings players={players} />
    </View>
  );
}
