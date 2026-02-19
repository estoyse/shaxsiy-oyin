import ButtonContainer from '@/components/game/buzzerButton';
import HeaderComponent from '@/components/game/header';
import LiveStandings from '@/components/game/liveStandings';
import QuestionComponent from '@/components/game/question';
import SafeArea from '@/components/safeArea';
import { useGameStore } from '@/store/useGameStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/providers/socketProvider';
import { AnswerResultPayload, Player, Question, SyncStatePayload } from '@/types/game';
import { toast } from 'sonner-native';
import { usePreventRemove } from '@react-navigation/native';

export default function RoomPage() {
  const { id } = useLocalSearchParams();
  const { session } = useAuthStore();
  const players = useGameStore((state) => state.players);
  const syncRoom = useGameStore((state) => state.syncRoom);
  const updatePlayers = useGameStore((state) => state.updatePlayers);
  const setQuestion = useGameStore((state) => state.setQuestion);
  const reset = useGameStore((state) => state.reset);
  const setLockedBy = useGameStore((state) => state.setLockedBy);
  const setGameState = useGameStore((state) => state.setGameState);
  const setScrambleTime = useGameStore((state) => state.setScrambleTime);
  const updatePlayerScore = useGameStore((state) => state.updatePlayerScore);
  const updateAnswers = useGameStore((state) => state.updateAnswers);
  const setRevealTime = useGameStore((state) => state.setRevealTime);
  const { socket } = useSocket();
  const [preventLeave, setPreventLeave] = useState(true);

  useEffect(() => {
    // Join the room
    if (!session || !socket) return;
    socket.emit('JOIN_ROOM', { roomId: id, token: session.access_token });
    reset();
    socket.on('JOIN_ROOM', (data: { success: boolean; roomId: string }) => {
      if (data.success) {
        console.log('Joined room:', data.roomId);

        toast.success('Joined room');
      } else {
        toast.error('Failed to join room');
        router.back();
      }
    });

    socket.on('ROOM_SYNC', (state: SyncStatePayload) => {
      console.log('ROOM_SYNC', state);
      syncRoom(state);
    });

    socket.on('PLAYER_JOINED', (data: { player: Player; reconnected?: boolean }) => {
      console.log('PLAYER_JOINED: ', data);
      // If player already exists, do not add
      if (players.find((player) => player.id === data.player.id)) return;
      updatePlayers(data.player);

      // If player is the current user, do not show toast
      if (data.player.id === session?.user.id) return;

      if (data.reconnected) {
        toast.success(`${data.player.name} reconnected to the room`);
        return;
      }
      toast.success(`${data.player.name} joined the room`);
    });

    socket.on('QUESTION_START', (data: Question) => {
      setQuestion(data);
      updateAnswers([], 0);
      setRevealTime(null);
      setGameState('SCRAMBLE');
    });

    socket.on('BUZZ_ACCEPTED', (data) => {
      setLockedBy(data.playerId);
      if (data.playerId === socket.id) {
        // It's me! Show input field.
        console.log('My turn to answer!');
      } else {
        // Someone else buzzed. Lock UI.
        console.log('BUZZ_ACCEPTED: ', data);
      }
    });

    socket.on('ANSWER_RESULT', (data: AnswerResultPayload) => {
      console.log('ANSWER_RESULT: ', data);
      setLockedBy(null);

      const questionEnded =
        data.reason === 'CORRECT_ANSWER' ||
        data.reason === 'STRIKE_LIMIT' ||
        data.reason === 'TIMEOUT';

      if (questionEnded) {
        const revealDurationMs = data.revealDuration ?? 12000;
        setRevealTime(Date.now() + revealDurationMs);
        setGameState('REVEAL');
      } else {
        // WRONG_ANSWER — question continues, others can still buzz
        setGameState('SCRAMBLE');
      }

      if (data.reason === 'STRIKE_LIMIT' || data.reason === 'TIMEOUT') {
        const revealAnswer = {
          correct: true,
          playerId: 'system',
          playerName: "To'g'ri javob",
          text: data.correctAnswer || 'Unknown',
          timestamp: Date.now(),
        };
        updateAnswers([...data.answers, revealAnswer], data.strikes);
      } else {
        updateAnswers(data.answers, data.strikes);
      }
      if (data.playerId) {
        updatePlayerScore(data.playerId, data.newScore);
      }
    });

    socket.on('RESET_SCRAMBLE', (data) => {
      const scrambleEndTime = data.duration + new Date().getTime();
      setScrambleTime(scrambleEndTime);
      console.log('Scramble reset data: ', data);
    });

    socket.on('GAME_END', () => {
      setPreventLeave(false);
      router.replace('/game/room/[id]/result');
    });

    return () => {
      socket.off('JOIN_ROOM');
      socket.off('ROOM_SYNC');
      socket.off('PLAYER_JOINED');
      socket.off('QUESTION_START');
      socket.off('BUZZ_ACCEPTED');
      socket.off('ANSWER_RESULT');
      socket.off('RESET_SCRAMBLE');
      socket.off('GAME_END');
    };
  }, [id, socket]);

  usePreventRemove(preventLeave, () => {
    Alert.alert('Xonani tark etish', 'Siz xonani tark etmoqchisiz. Davom etasizmi?', [
      { text: "Yo'q", style: 'cancel', onPress: () => {} },
      {
        text: 'Tark etish',
        style: 'destructive',
        onPress: () => {
          setPreventLeave(false);
          socket?.emit('LEAVE_ROOM', { roomId: id, token: session?.access_token });
          router.back();
        },
      },
    ]);
  });

  return (
    <View className="bg-background flex-1">
      <SafeArea edges={['top']}>
        <View className="flex-1">
          <HeaderComponent />
          <QuestionComponent />
          <ButtonContainer />
        </View>
      </SafeArea>

      <LiveStandings players={players} />
    </View>
  );
}
