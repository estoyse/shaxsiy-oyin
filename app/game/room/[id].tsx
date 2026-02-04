import ButtonContainer from '@/components/game/buzzerButton';
import HeaderComponent from '@/components/game/header';
import LiveStandings from '@/components/game/liveStandings';
import QuestionComponent from '@/components/game/question';
import SafeArea from '@/components/safeArea';
import { useGameStore } from '@/store/useGameStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/providers/socketProvider';
import { Player, SyncStatePayload } from '@/types/game';
import { toast } from 'sonner-native';

export default function RoomPage() {
  const { id } = useLocalSearchParams();
  const { session } = useAuthStore();
  const players = useGameStore((state) => state.players);
  const syncRoom = useGameStore((state) => state.syncRoom);
  const updatePlayers = useGameStore((state) => state.updatePlayers);
  const { socket } = useSocket();

  useEffect(() => {
    // Join the room
    if (!session || !socket) return;
    socket.emit('JOIN_ROOM', { roomId: id, token: session.access_token });
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
      console.log('PLAYER_JOINED', data.player);
      updatePlayers(data.player);
    });

    return () => {
      socket.off('JOIN_ROOM');
      socket.off('ROOM_SYNC');
    };
  }, [id, socket]);

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
