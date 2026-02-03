import { View } from 'react-native';
import Animated, { CSSAnimationKeyframes } from 'react-native-reanimated';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { BookTextIcon, TimerIcon } from 'lucide-react-native';

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
  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <View className="flex-row items-center gap-2">
        <Animated.View
          style={{
            animationName: pulse,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
          }}
          className="size-2 animate-pulse rounded-full bg-violet-500"></Animated.View>
        <Text className="text-violet-500">O'qilmoqda</Text>
      </View>
      <View className="items-center justify-center"></View>
      <View className="flex-row items-center justify-center gap-2">
        <View className="bg-card border-border h-9 flex-row items-center gap-2 rounded-full border px-3 shadow-sm">
          <Icon as={BookTextIcon} className="text-muted-foreground text-lg" />
          <Text className="text-muted-foreground font-mono text-[15px] font-bold">5</Text>
        </View>
        <View className="bg-card border-border h-9 flex-row items-center gap-2 rounded-full border px-3 shadow-sm">
          <Icon as={TimerIcon} className="text-lg text-amber-600" />
          <Text className="font-mono text-[15px] font-bold text-amber-600">08s</Text>
        </View>
      </View>
    </View>
  );
}
