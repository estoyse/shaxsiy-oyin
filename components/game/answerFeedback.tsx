import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CheckCircle2, XCircle, History } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { GivenAnswer } from '@/types/game';

interface AnswerFeedbackProps {
  answers: GivenAnswer[];
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
          latestAnswer.correct
            ? 'border-green-500/30 bg-green-500/10'
            : 'border-red-500/30 bg-red-500/10'
        }`}>
        {/* Latest Answer - Highlights */}
        <View className="flex-row items-center gap-4">
          <Icon
            as={latestAnswer.correct ? CheckCircle2 : XCircle}
            size={36}
            color={latestAnswer.correct ? '#22C55E' : '#EF4444'}
          />
          <View className="flex-1">
            <Text
              className={`text-xl font-bold ${
                latestAnswer.correct ? 'text-green-500' : 'text-red-500'
              }`}>
              {latestAnswer.correct ? "To'g'ri!" : "Noto'g'ri!"}
            </Text>
            <Text className="text-sm font-medium text-white" numberOfLines={1}>
              {latestAnswer.playerName}:{' '}
              <Text className="text-zinc-300">"{latestAnswer.text}"</Text>
            </Text>
          </View>
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
