import SafeArea from '@/components/safeArea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { BellIcon, PlusIcon, Users2Icon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react-native';

export interface Game {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  roundsLeft: number;
  totalRounds: number;
  status: 'waiting' | 'in-progress' | 'final-round';
  gameType: string;
  startedAt: string;
}

export const activeGames: Game[] = [
  {
    id: '1',
    name: 'Epic Battle Royale',
    players: 8,
    maxPlayers: 10,
    roundsLeft: 5,
    totalRounds: 10,
    status: 'in-progress',
    gameType: 'Battle Royale',
    startedAt: '2026-02-01T10:30:00Z',
  },
  {
    id: '2',
    name: 'Speed Chess Masters',
    players: 4,
    maxPlayers: 4,
    roundsLeft: 1,
    totalRounds: 7,
    status: 'final-round',
    gameType: 'Chess',
    startedAt: '2026-02-01T09:15:00Z',
  },
  {
    id: '3',
    name: 'Tower Defense Pro',
    players: 6,
    maxPlayers: 8,
    roundsLeft: 12,
    totalRounds: 15,
    status: 'in-progress',
    gameType: 'Tower Defense',
    startedAt: '2026-02-01T11:00:00Z',
  },
  {
    id: '4',
    name: 'Trivia Night',
    players: 10,
    maxPlayers: 10,
    roundsLeft: 8,
    totalRounds: 10,
    status: 'waiting',
    gameType: 'Trivia',
    startedAt: '2026-02-01T10:45:00Z',
  },
  {
    id: '5',
    name: 'Racing Championship',
    players: 7,
    maxPlayers: 8,
    roundsLeft: 3,
    totalRounds: 8,
    status: 'in-progress',
    gameType: 'Racing',
    startedAt: '2026-02-01T09:30:00Z',
  },
  {
    id: '6',
    name: 'Card Clash',
    players: 4,
    maxPlayers: 6,
    roundsLeft: 6,
    totalRounds: 10,
    status: 'in-progress',
    gameType: 'Card Game',
    startedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: '7',
    name: 'Puzzle Masters',
    players: 5,
    maxPlayers: 8,
    roundsLeft: 2,
    totalRounds: 5,
    status: 'final-round',
    gameType: 'Puzzle',
    startedAt: '2026-02-01T08:45:00Z',
  },
  {
    id: '8',
    name: 'Strategy Showdown',
    players: 6,
    maxPlayers: 6,
    roundsLeft: 10,
    totalRounds: 12,
    status: 'in-progress',
    gameType: 'Strategy',
    startedAt: '2026-02-01T11:15:00Z',
  },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userInitial = user?.email?.[0].toUpperCase() ?? 'U';
  const userName = user?.email?.split('@')[0] ?? 'User';
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return (
    <View className="bg-background flex-1">
      <SafeArea edges={['top']}>
        <View className="flex-1">
          <View className="flex-row items-center justify-between border-b border-gray-600/50 px-3">
            <Pressable className="active:bg-accent dark:active:bg-accent/50 flex-row gap-2 rounded p-2 pr-4 transition-colors">
              <Avatar className="size-12" alt="User Avatar">
                <AvatarFallback>
                  <Text>{userInitial}</Text>
                </AvatarFallback>
              </Avatar>
              <View className="justify-center">
                <Text className="text-lg leading-none font-medium">{userName}</Text>
                <Text className="pt-1 text-sm leading-none text-gray-500">online</Text>
              </View>
            </Pressable>
            <View className="flex-row items-center gap-1">
              <Button
                variant="ghost"
                className="aspect-square size-12 rounded-full p-4"
                onPress={handleLogout}>
                <Icon as={LogOut} size={24} />
              </Button>
              <Button variant="ghost" className="aspect-square size-12 rounded-full p-4">
                <Icon as={BellIcon} size={24} />
              </Button>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 12 }}>
            <View className="mt-8 gap-2">
              <Button
                onPress={() => router.push(`/game/new`)}
                className="h-16 rounded-full border-2 border-sky-300 bg-sky-100 transition-colors duration-100 active:bg-sky-200 dark:border-sky-700 dark:bg-sky-500 dark:active:bg-sky-400">
                <Icon
                  as={PlusIcon}
                  size={24}
                  className="text-primary-foreground light:text-primary"
                />
                <Text className="light:text-primary text-xl">Yangi o'yin</Text>
              </Button>
              <Button
                onPress={() => router.push(`/game/room/TBLGHR`)}
                className="h-16 rounded-full border-2 border-emerald-300 bg-emerald-100 transition-colors duration-100 active:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-500 dark:active:bg-emerald-400">
                <Icon
                  as={Users2Icon}
                  size={24}
                  className="text-primary-foreground light:text-primary"
                />
                <Text className="light:text-primary text-xl">O'yinga qo'shilish</Text>
              </Button>
            </View>
            <View>
              <View className="mt-5 flex-row justify-between p-3">
                <Text>Reyting</Text>
                <Text>To'liq ro'yxat</Text>
              </View>
              <View className="gap-2 rounded-2xl bg-neutral-200 p-3 dark:bg-neutral-900">
                <View className="pxp-28 flex-row items-center justify-between rounded bg-yellow-300 p-2 dark:bg-yellow-600">
                  <View className="flex-row items-center gap-3">
                    <Text>1.</Text>
                    <Avatar className="size-8" alt="Zach Nugent's Avatar">
                      <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                      <AvatarFallback>
                        <Text>ZN</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Text>John Doe</Text>
                  </View>
                  <Text>2347 pts</Text>
                </View>
                <View className="pxp-28 flex-row items-center justify-between rounded bg-zinc-300 p-2 dark:bg-zinc-500">
                  <View className="flex-row items-center gap-3">
                    <Text>1.</Text>
                    <Avatar className="size-8" alt="Zach Nugent's Avatar">
                      <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                      <AvatarFallback>
                        <Text>ZN</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Text>John Doe</Text>
                  </View>
                  <Text>2347 pts</Text>
                </View>
                <View className="pxp-28 flex-row items-center justify-between rounded bg-yellow-600 p-2 dark:bg-yellow-900">
                  <View className="flex-row items-center gap-3">
                    <Text>1.</Text>
                    <Avatar className="size-8" alt="Zach Nugent's Avatar">
                      <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                      <AvatarFallback>
                        <Text>ZN</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Text>John Doe</Text>
                  </View>
                  <Text>2347 pts</Text>
                </View>
                <View className="pxp-28 flex-row items-center justify-between rounded bg-stone-400 p-2 dark:bg-stone-800">
                  <View className="flex-row items-center gap-3">
                    <Text>1.</Text>
                    <Avatar className="size-8" alt="Zach Nugent's Avatar">
                      <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                      <AvatarFallback>
                        <Text>ZN</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Text>John Doe</Text>
                  </View>
                  <Text>2347 pts</Text>
                </View>
                <View className="pxp-28 flex-row items-center justify-between rounded bg-stone-400 p-2 dark:bg-stone-800">
                  <View className="flex-row items-center gap-3">
                    <Text>1.</Text>
                    <Avatar className="size-8" alt="Zach Nugent's Avatar">
                      <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                      <AvatarFallback>
                        <Text>ZN</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Text>John Doe</Text>
                  </View>
                  <Text>2347 pts</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeArea>
    </View>
  );
}
