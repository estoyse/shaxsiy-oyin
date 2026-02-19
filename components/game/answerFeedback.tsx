import React, { useMemo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { CheckCircle2, XCircle, History } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { GivenAnswer } from '@/types/game';
import { useGameStore } from '@/store/useGameStore';
import Svg, { Circle } from 'react-native-svg';

interface AnswerFeedbackProps {
  answers: GivenAnswer[];
}

const TIMER_SIZE = 44;
const STROKE_WIDTH = 3;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function RevealCountdown() {
  const revealEndTime = useGameStore((state) => state.revealEndTime);
  const setGameState = useGameStore((state) => state.setGameState);
  const setRevealTime = useGameStore((state) => state.setRevealTime);

  const totalDuration = 12000; // default, ms
  const [remaining, setRemaining] = useState<number>(totalDuration);

  useEffect(() => {
    if (!revealEndTime) return;

    const update = () => {
      const left = Math.max(0, revealEndTime - Date.now());
      setRemaining(left);
      if (left <= 0) {
        setGameState('SCRAMBLE');
        setRevealTime(null);
      }
    };

    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [revealEndTime]);

  const secondsLeft = Math.ceil(remaining / 1000);
  const progress = remaining / totalDuration; // 1 → 0
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View className="items-center justify-center">
      <Svg width={TIMER_SIZE} height={TIMER_SIZE}>
        {/* Track */}
        <Circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={RADIUS}
          stroke="#3f3f46"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={RADIUS}
          stroke={secondsLeft <= 3 ? '#EF4444' : '#A78BFA'}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${TIMER_SIZE / 2}, ${TIMER_SIZE / 2}`}
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text
          className={`text-sm font-bold ${secondsLeft <= 3 ? 'text-red-400' : 'text-violet-300'}`}>
          {secondsLeft}
        </Text>
      </View>
    </View>
  );
}

export default function AnswerFeedback({ answers }: AnswerFeedbackProps) {
  const sortedAnswers = useMemo(() => {
    return [...answers].sort((a, b) => b.timestamp - a.timestamp);
  }, [answers]);

  const latestAnswer = sortedAnswers[0];
  const history = sortedAnswers.slice(1);

  if (!latestAnswer) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      className="items-center justify-center p-2">
      <Animated.View
        entering={FadeIn.delay(200).springify()}
        className={`w-full rounded-3xl border-2 p-4 shadow-xl ${
          latestAnswer.playerId === 'system'
            ? 'border-violet-500/30 bg-violet-500/10'
            : latestAnswer.correct
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-red-500/30 bg-red-500/10'
        }`}>
        {/* Latest Answer - Highlights */}
        <View className="flex-row items-center gap-4">
          <Icon
            as={
              latestAnswer.playerId === 'system'
                ? History
                : latestAnswer.correct
                  ? CheckCircle2
                  : XCircle
            }
            size={36}
            color={
              latestAnswer.playerId === 'system'
                ? '#A78BFA'
                : latestAnswer.correct
                  ? '#22C55E'
                  : '#EF4444'
            }
          />
          <View className="flex-1">
            <Text
              className={`text-xl font-bold ${
                latestAnswer.playerId === 'system'
                  ? 'text-violet-400'
                  : latestAnswer.correct
                    ? 'text-green-500'
                    : 'text-red-500'
              }`}>
              {latestAnswer.playerId === 'system'
                ? 'Savol yakunlandi'
                : latestAnswer.correct
                  ? "To'g'ri!"
                  : "Noto'g'ri!"}
            </Text>
            <Text className="text-sm font-medium text-white" numberOfLines={1}>
              {latestAnswer.playerName}:{' '}
              <Text className="text-zinc-300">"{latestAnswer.text}"</Text>
            </Text>
          </View>

          {/* Countdown Timer */}
          <RevealCountdown />
        </View>

        {/* History of answers if any */}
        {history.length > 0 && (
          <View className="mt-4 border-t border-zinc-700/50 pt-3">
            <View className="mb-2 flex-row items-center gap-1.5 opacity-50">
              <Icon as={History} size={12} color="#A1A1AA" />
              <Text className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Oldingi urinishlar
              </Text>
            </View>
            <View className="gap-2">
              {history.map((ans, index) => (
                <View
                  key={`${ans.playerId}-${ans.timestamp}`}
                  className="flex-row items-center gap-2">
                  <Icon as={XCircle} size={14} color="#EF4444" />
                  <Text className="text-xs text-zinc-400" numberOfLines={1}>
                    <Text className="font-semibold text-zinc-300">{ans.playerName}</Text>: "
                    {ans.text}"
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}
