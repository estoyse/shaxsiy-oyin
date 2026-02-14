import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useGameStore } from '@/store/useGameStore';

// Create an animated version of the SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export default function CircularTimer({
  size = 200,
  strokeWidth = 6,
  children,
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const serverTimeOffset = useGameStore((state) => state.serverTimeOffset);
  const endTime = useGameStore((state) => state.scrambleEndTime);

  // 1. Use SharedValue instead of Animated.Value
  const progress = useSharedValue(0);

  const duration = useMemo(() => {
    const timeLeft = (endTime ?? 0) - new Date().getTime() + serverTimeOffset;
    return timeLeft > 0 ? timeLeft : 0;
  }, [serverTimeOffset, endTime]);

  useEffect(() => {
    // 2. Reset and trigger animation via Reanimated
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: duration,
      easing: Easing.linear,
    });
  }, [duration]);

  // 3. Define the animated props to be applied to the Circle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * progress.value,
    };
  });

  return (
    <View style={{ width: size, height: size }} className="relative items-center justify-center">
      <View className="absolute inset-0">
        <Svg width={size} height={size}>
          {/* Track (Background) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#27272a"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress (Animated) */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps} // 4. Apply animated props here
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
      </View>
      {children}
    </View>
  );
}
