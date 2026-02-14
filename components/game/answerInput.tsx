import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SendHorizonal } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { useSocket } from '@/providers/socketProvider';
import { useGameStore } from '@/store/useGameStore';

export default function AnswerInput() {
  const [answerText, setAnswerText] = useState('');
  const { socket } = useSocket();
  const serverTimeOffset = useGameStore((state) => state.serverTimeOffset);
  const expiresAt = useGameStore((state) => state.expiresAt);

  // Linear timer animation
  const progress = useSharedValue(1);

  const duration = useMemo(() => {
    if (!expiresAt) return 15000; // fallback 15s
    const deadline = new Date(expiresAt).getTime();
    const timeLeft = deadline - Date.now() + serverTimeOffset;
    return timeLeft > 0 ? timeLeft : 0;
  }, [expiresAt, serverTimeOffset]);

  useEffect(() => {
    progress.value = 1;
    progress.value = withTiming(0, {
      duration,
      easing: Easing.linear,
    });
  }, [duration]);

  const timerBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 0.3, 1],
        ['#ef4444', '#f59e0b', '#22c55e']
      ),
    };
  });

  const handleSubmit = () => {
    if (!answerText.trim() || !socket) return;
    socket.emit('ANSWER_SUBMIT', { text: answerText.trim() });
    setAnswerText('');
  };

  return (
    <View className="flex-1 gap-4">
      {/* Linear Timer Bar */}
      <View className="overflow-hidden rounded-full">
        <View className="h-2 w-full rounded-full bg-white/10">
          <Animated.View className="h-full rounded-full" style={timerBarStyle} />
        </View>
      </View>

      {/* Label */}
      <Text className="text-center text-sm font-semibold text-indigo-300">Javobingizni yozing</Text>

      {/* Input + Submit */}
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Input
            placeholder="Javob..."
            value={answerText}
            onChangeText={setAnswerText}
            onSubmitEditing={handleSubmit}
            autoFocus
            className="text-foreground h-14 rounded-2xl border-indigo-500/40 bg-indigo-500/10 px-5 text-base"
          />
        </View>
        <Button
          onPress={handleSubmit}
          className="h-14 w-14 rounded-2xl bg-indigo-500 active:bg-indigo-600"
          disabled={!answerText.trim()}>
          <Icon as={SendHorizonal} size={22} color="#FFFFFF" />
        </Button>
      </View>
    </View>
  );
}
