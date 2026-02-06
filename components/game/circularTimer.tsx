import Svg, { Circle } from 'react-native-svg';
import { Animated, Easing, View } from 'react-native';
import React from 'react';
import { useGameStore } from '@/store/useGameStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularTimer({
  size = 170,
  strokeWidth = 6,
  children,
}: {
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const serverTimeOffset = useGameStore((state) => state.serverTimeOffset);
  const endTime = useGameStore((state) => state.currentQuestion?.scrambleEndTime);

  const progress = React.useRef(new Animated.Value(0)).current;

  const duration = React.useMemo(() => {
    return (endTime ?? 0) - new Date().getTime() + serverTimeOffset;
  }, [serverTimeOffset, endTime]);

  React.useEffect(() => {
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
  });

  return (
    <View style={{ width: size, height: size }} className="relative items-center justify-center">
      <View className="absolute inset-0">
        <Svg width={size} height={size} className="">
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#27272a"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
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
