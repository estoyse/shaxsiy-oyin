import SafeArea from '@/components/safeArea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { BellIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react-native';
import ArcadeScreen from '@/components/home/games';

const featuredGame = {
  id: 'shaxsiy-oyin',
  title: "Shaxsiy O'yin",
  description: 'Beat the clock in this high-speed synthwave runner.',
  image: 'https://picsum.photos/seed/cyberpunk/600/400',
  badge: 'Daily Challenge',
  rating: 5,
};

const games = [
  {
    id: 'zakovat-quiz',
    title: 'Zakovat Quiz',
    category: 'Brain Training',
    rating: 4.9,
    image: 'https://picsum.photos/seed/math/300/300',
  },
  {
    id: 'zakovat-minutka',
    title: 'Zakovat Minutka',
    category: 'Puzzle',
    rating: 4.5,
    image: 'https://picsum.photos/seed/puzzle/300/300',
  },
  {
    id: 'trivia-king',
    title: 'Trivia King',
    category: 'Knowledge',
    rating: 4.8,
    image: 'https://picsum.photos/seed/trivia/300/300',
    isHot: true,
  },
  {
    id: 'word-scape',
    title: 'Word Scape',
    category: 'Casual',
    rating: 4.2,
    image: 'https://picsum.photos/seed/word/300/300',
  },
];

const recentGame = {
  id: 'chess',
  title: 'Master Chess',
  level: 12,
  progress: 65,
  image: 'https://picsum.photos/seed/chess/100/100',
};

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
          <View className="flex-row items-center justify-between px-3">
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

          <ArcadeScreen
            featuredGame={featuredGame}
            games={games}
            recentGame={recentGame}
            walletBalance={2450}
            onBack={() => console.log('Back')}
            onPlayFeatured={(id) => console.log('Play featured', id)}
            onPlayGame={(id) => console.log('Play game', id)}
            onPlayRecent={(id) => console.log('Play recent', id)}
            onViewAllRecent={() => console.log('View all recent')}
          />

          {/* <ScrollView
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
                onPress={() => router.push(`/game/room/TBLGHR/result`)}
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
          </ScrollView> */}
        </View>
      </SafeArea>
    </View>
  );
}
