import { Pressable, View } from 'react-native';
import Animated, { CSSAnimationKeyframes } from 'react-native-reanimated';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { BookTextIcon, TimerIcon } from 'lucide-react-native';
import { useGameStore } from '@/store/useGameStore';
import { useSocket } from '@/providers/socketProvider';
import { toast } from 'sonner-native';
import { useEffect, useMemo } from 'react';
import { useQuestionTimer } from '@/hooks/useQuestionTimer';
import { useServerTime } from '@/hooks/useServerTime';
import { GameState } from '@/types/game';

const pulse: CSSAnimationKeyframes = {
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.2,
  },
  '100%': {
    opacity: 1,
  },
};

export default function HeaderComponent() {
  const { socket } = useSocket();
  const serverTime = useServerTime();
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const questionIndex = useGameStore((state) => state.currentQuestion?.questionIndex);
  const categoriesCount = useGameStore((state) => state.categoriesCount);
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);

  const remainingMs = useQuestionTimer(currentQuestion?.scrambleEndTime || 0, serverTime.now);

  const secondsLeft = Math.ceil(remainingMs / 1000);

  const categoriesState = useMemo(() => {
    return `${Math.floor((questionIndex ?? 0) / 5 + 1)}/${categoriesCount}`;
  }, [questionIndex, categoriesCount]);

  useEffect(() => {
    if (!socket) return;
    socket.on('GAME_START', (data: { count: number; gameState: GameState }) => {
      console.log('GAME_START: ', data);
      setGameState(data.gameState);
      toast.success('Game started');
    });

    return () => {
      socket.off('GAME_START');
    };
  }, [socket]);

  const handleGameStart = () => {
    if (!socket) {
      toast.error('Connection error. Please try again later');
      return;
    }
    socket.emit('GAME_START');
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <Pressable onPress={handleGameStart} className="flex-row items-center gap-2">
        <Animated.View
          style={{
            animationName: pulse,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
          }}
          className="size-2 animate-pulse rounded-full bg-violet-500"></Animated.View>
        <Text className="text-violet-500">{gameState}</Text>
      </Pressable>
      <View className="items-center justify-center"></View>
      <View className="flex-row items-center justify-center gap-2">
        <View className="bg-card border-border h-9 flex-row items-center gap-2 rounded-full border px-3 shadow-sm">
          <Icon as={BookTextIcon} className="text-muted-foreground text-lg" />
          <Text className="text-muted-foreground font-mono text-[15px] font-bold">
            {categoriesCount > 0 ? categoriesState : '-'}
          </Text>
        </View>
        <View className="bg-card border-border h-9 flex-row items-center gap-2 rounded-full border px-3 shadow-sm">
          <Icon as={TimerIcon} className="text-lg text-amber-600" />
          <Text className="font-mono text-[15px] font-bold text-amber-600">
            {secondsLeft.toString().padStart(2, '0')}s
          </Text>
        </View>
      </View>
    </View>
  );
}
