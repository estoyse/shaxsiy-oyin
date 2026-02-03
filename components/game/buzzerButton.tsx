import { Image, View } from 'react-native';
import { Icon } from '../ui/icon';
import { XIcon, BellRingIcon } from 'lucide-react-native';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

export default function ButtonContainer({
  answering,
  setAnswering,
  players,
}: {
  answering: boolean;
  setAnswering: (answering: boolean) => void;
  players: any[];
}) {
  return (
    <View className="from-background via-background/90 absolute right-0 bottom-0 left-0 bg-linear-to-t to-transparent p-4 pb-[40%]">
      {!answering ? (
        <View className="flex-row items-center justify-between gap-4">
          <View className="border-border bg-card flex items-center gap-6 rounded-full border p-4">
            <Icon as={XIcon} className="text-red-500" />
            <Icon as={XIcon} className="text-red-500" />
            <Icon as={XIcon} className="light:text-gray-300 text-red-100" />
          </View>
          <Button
            className="tactile-button relative z-10 flex size-40 flex-col items-center justify-center rounded-full bg-red-500 transition-transform duration-300 active:scale-96 active:bg-red-500"
            onPress={() => setAnswering(true)}>
            <Icon as={BellRingIcon} size={36} />
            <Text className="font-dm-bold align text-3xl font-black tracking-tighter text-white">
              BUZZ
            </Text>
          </Button>

          <View className="border-border bg-card flex items-center gap-6 rounded-full border p-4 opacity-0">
            <Icon as={XIcon} className="text-red-500" />
            <Icon as={XIcon} className="text-red-500" />
            <Icon as={XIcon} className="light:text-gray-300 text-red-100" />
          </View>
        </View>
      ) : (
        <View className="bg-card w-full flex-row items-center gap-4 rounded-full border border-violet-500/50 p-2 pr-6 shadow-lg shadow-violet-500/10">
          <Image
            source={{ uri: players[0].avatar }}
            className="h-12 w-12 rounded-full border-2 border-violet-500"
          />
          <View className="flex-1">
            <Text className="text-foreground text-lg font-bold">You</Text>
            <Text className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              is answering...
            </Text>
          </View>
          <View className="animate-pulse">
            <View className="h-3 w-3 rounded-full bg-violet-500" />
          </View>
        </View>
      )}
    </View>
  );
}
