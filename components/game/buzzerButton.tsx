import { useEffect, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { Icon } from '../ui/icon';
import { XIcon, BellRingIcon } from 'lucide-react-native';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { useSocket } from '@/providers/socketProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { toast } from 'sonner-native';
import CircularTimer from './circularTimer';
import AnsweringCard from './answerCard';
import AnswerInput from './answerInput';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function ButtonContainer() {
  const { socket, isConnected } = useSocket();
  const user = useAuthStore((state) => state.user);
  const lockedBy = useGameStore((state) => state.lockedBy);
  const players = useGameStore((state) => state.players);
  const wrongAnswers = useGameStore((state) => state.wrongAnswersInRoom);
  const gameState = useGameStore((state) => state.gameState);

  const isMyBuzz = lockedBy != null && lockedBy === user?.id;

  // Keyboard-aware bottom offset
  const bottomOffset = useSharedValue(0);

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardOpen(true);
      bottomOffset.value = withTiming(e.endCoordinates.height, { duration: 250 });
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardOpen(false);
      bottomOffset.value = withTiming(0, { duration: 250 });
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    bottom: bottomOffset.value,
  }));

  const handleBuzzerPress = () => {
    if (gameState !== 'SCRAMBLE') {
      toast.error("O'yin hali boshlanmadi");
      return;
    }
    if (!socket) {
      toast.error('Connection error. Please try again later');
      return;
    }

    if (!isConnected) {
      toast.error('You are not connected to the server');
      return;
    }
    socket.emit('BUZZ', { playerId: user?.id });
  };

  return (
    <Animated.View
      className={`from-background via-background/90 absolute right-0 bottom-0 left-0 bg-linear-to-t to-transparent p-4 ${keyboardOpen ? 'pb-4' : 'pb-[40%]'}`}
      style={animatedContainerStyle}>
      {lockedBy ? (
        isMyBuzz ? (
          <AnswerInput />
        ) : (
          <AnsweringCard
            playerName={players.find((player) => player.id === lockedBy)?.name!}
            playerAvatar={players.find((player) => player.id === lockedBy)?.avatar!}
          />
        )
      ) : (
        <View className="flex-row items-center justify-between gap-4">
          <View className="border-border bg-card flex items-center gap-6 rounded-full border p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Icon
                as={XIcon}
                className={index < wrongAnswers ? 'text-red-500' : 'text-gray-300'}
                key={index}
              />
            ))}
          </View>
          <View className="relative flex items-center justify-center">
            <CircularTimer size={175} strokeWidth={6}>
              <Button
                className="tactile-button flex size-40 flex-col items-center justify-center rounded-full bg-red-500 transition-transform duration-300 active:scale-96 active:bg-red-500"
                onPress={handleBuzzerPress}>
                <Icon as={BellRingIcon} size={36} />
                <Text className="font-dm-bold text-3xl font-black tracking-tighter text-white">
                  BUZZ
                </Text>
              </Button>
            </CircularTimer>
          </View>

          <View className="border-border bg-card flex items-center gap-6 rounded-full border p-4 opacity-0">
            <Icon as={XIcon} className="text-red-500" />
            <Icon as={XIcon} className="text-red-500" />
            <Icon as={XIcon} className="light:text-gray-300 text-red-100" />
          </View>
        </View>
      )}
    </Animated.View>
  );
}
