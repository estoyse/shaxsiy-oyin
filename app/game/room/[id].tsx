import SafeArea from '@/components/safeArea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import { BellRingIcon, BookTextIcon, TimerIcon, XIcon } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import Animated, { CSSAnimationKeyframes } from 'react-native-reanimated';

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

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isOnline: boolean;
  isCurrentUser?: boolean;
  status?: string;
}

const players: Player[] = [
  {
    id: '1',
    name: 'You',
    score: 1450,
    avatar: 'https://picsum.photos/seed/user1/40/40',
    isOnline: true,
    isCurrentUser: true,
    status: 'Buzzing...',
  },
  {
    id: '2',
    name: 'Sarah K.',
    score: 1200,
    avatar: 'https://picsum.photos/seed/user2/40/40',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Mike R.',
    score: 980,
    avatar: 'https://picsum.photos/seed/user3/40/40',
    isOnline: false,
  },
  {
    id: '4',
    name: 'Elena T.',
    score: 850,
    avatar: 'https://picsum.photos/seed/user4/40/40',
    isOnline: false,
  },
];

export default function RoomPage() {
  const { id } = useLocalSearchParams();
  const [answering, setAnswering] = useState(false);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['15%', '50%'], []);

  return (
    <View className="bg-background flex-1">
      <SafeArea edges={['top']}>
        <View className="flex-1">
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
          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-96"
            showsVerticalScrollIndicator={false}>
            <View className="gap-2">
              <Card className="mx-4 py-4">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>-TAR-</CardTitle>
                  <CardDescription>
                    <Badge variant={'default'} className="p-1 px-4">
                      <Text className="text-md">50</Text>
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?
                  </Text>
                </CardContent>
              </Card>
            </View>
          </ScrollView>

          {/* Fixed Button Container */}
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
              <View>
                <Text>Dummy</Text>
              </View>
            )}
          </View>
        </View>
      </SafeArea>

      {/* Live Standings Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={{ backgroundColor: '#e5e7eb' }}
        backgroundStyle={{
          backgroundColor: '#1e293b',
        }}>
        <BottomSheetView className="flex-1 bg-slate-800">
          <View className="border-border flex-row items-center justify-between border-b px-6 py-4">
            <Text className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Players ({players.length})
            </Text>
            <View className="flex-row items-center gap-1">
              <View className="bg-chart-2 h-1.5 w-1.5 rounded-full" />
              <Text className="text-chart-2 text-[12px] font-semibold uppercase">Live</Text>
            </View>
          </View>
          <BottomSheetScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            {players.map((player, index) => (
              <View
                key={player.id}
                className={`h-14 flex-row items-center justify-between ${
                  index < players.length - 1 ? 'border-border/50 border-b' : ''
                } ${!player.isCurrentUser ? 'opacity-80' : ''}`}>
                {/* Left Side - Avatar and Info */}
                <View className="flex-row items-center gap-3">
                  <View className="relative">
                    <Image
                      source={{ uri: player.avatar }}
                      className={`h-10 w-10 rounded-full ${
                        player.isCurrentUser ? 'border-primary border-2' : ''
                      }`}
                      style={
                        !player.isCurrentUser && {
                          opacity: 0.7,
                        }
                      }
                    />
                    {/* Online Status Indicator */}
                    <View
                      className={`border-card absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 ${
                        player.isOnline ? 'bg-chart-2' : 'bg-muted-foreground'
                      }`}
                    />
                  </View>

                  <View>
                    {player.isCurrentUser ? (
                      <>
                        <Text className="text-primary text-[15px] font-semibold">
                          {player.name}
                        </Text>
                        {player.status && (
                          <Text className="text-primary text-[11px]">{player.status}</Text>
                        )}
                      </>
                    ) : (
                      <Text className="text-secondary-foreground text-[15px] font-medium">
                        {player.name}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Right Side - Score */}
                <View className="items-end">
                  <Text
                    className={`text-[17px] ${
                      player.isCurrentUser
                        ? 'text-accent-foreground font-bold'
                        : 'text-muted-foreground font-semibold'
                    }`}>
                    {player.score.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
