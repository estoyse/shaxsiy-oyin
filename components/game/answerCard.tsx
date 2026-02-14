import React from 'react';
import { View } from 'react-native';
import { Lock, Pencil } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Text } from '../ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icon } from '../ui/icon';

interface AnsweringCardProps {
  playerName: string;
  playerAvatar: string;
}

export default function AnsweringCard({ playerName, playerAvatar }: AnsweringCardProps) {
  // Pulse animation for glow
  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      ),
    };
  });

  // Typing dots animations
  const createDotAnimation = (delay: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withRepeat(
              withSequence(
                withTiming(0, { duration: 0 }),
                withTiming(1, { duration: 560, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 840, easing: Easing.inOut(Easing.ease) })
              ),
              -1,
              false
            ),
          },
        ],
      };
    });
  };

  const dot1Style = createDotAnimation(0);
  const dot2Style = createDotAnimation(160);
  const dot3Style = createDotAnimation(320);

  return (
    <View className="relative min-h-[300px] flex-1 overflow-hidden rounded-3xl border border-red-500/30">
      {/* Background */}
      <View className="bg-card absolute inset-0" />
      <View className="absolute inset-0 bg-red-500/10" />

      {/* Locked Message Badge */}
      <View className="absolute top-4 z-20 flex w-full items-center">
        <View className="flex-row items-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-4 py-1.5">
          <Icon as={Lock} size={14} color="#FCA5A5" />
          <Text className="text-xs font-semibold tracking-wide text-red-200 uppercase">
            You are locked for now
          </Text>
        </View>
      </View>

      {/* Central Content */}
      <View className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        {/* Avatar with Glow */}
        <View className="relative mb-6">
          {/* Glow Effect */}
          <Animated.View
            className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl"
            style={pulseStyle}
          />

          {/* Avatar */}
          <View className="relative">
            <Avatar
              alt={playerName}
              className="border-card ring-offset-background h-20 w-20 border-4 shadow-xl ring-2 ring-indigo-500 ring-offset-2">
              <AvatarImage source={{ uri: playerAvatar }} />
              <AvatarFallback>
                <Text className="text-2xl font-bold">
                  {playerName?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </AvatarFallback>
            </Avatar>

            {/* Pen Badge */}
            <View className="border-card absolute -right-2 -bottom-2 rounded-full border-4 bg-indigo-500 p-1.5">
              <Icon as={Pencil} size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Player Name & Status */}
        <View className="mb-6 items-center">
          {/* Name with Typing Dots */}
          <View className="mb-1 flex-row items-center justify-center gap-2">
            <Text className="text-foreground text-[19px] font-bold">{playerName}</Text>

            {/* Typing Dots */}
            <View className="mt-1 flex-row gap-1">
              <Animated.View className="h-1 w-1 rounded-full bg-indigo-400" style={dot1Style} />
              <Animated.View className="h-1 w-1 rounded-full bg-indigo-400" style={dot2Style} />
              <Animated.View className="h-1 w-1 rounded-full bg-indigo-400" style={dot3Style} />
            </View>
          </View>

          {/* Status Text */}
          <Text className="text-[15px] font-medium text-indigo-300">is answering...</Text>
        </View>
      </View>
    </View>
  );
}
