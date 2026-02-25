import SafeArea from '@/components/safeArea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter, Href } from 'expo-router';
import { BellIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react-native';
import ArcadeScreen from '@/components/home/games';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const userInitial = user?.email?.[0].toUpperCase() ?? 'U';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const logout = useAuthStore((state) => state.logout);

  const featuredGame = {
    id: 'shaxsiy-oyin',
    title: t('games.shaxsiy_oyin.title'),
    description: t('games.shaxsiy_oyin.description'),
    image:
      'https://lh5.googleusercontent.com/proxy/yFM3MFBh7lxo9WGMnUDQC0zX0XiXq0Hra0oXHeTBOzcpwYWQZj7qZ1BIW5vFR-ba9bCYTrqaPTA1xbnbKU1cxdaEkMxqvJmX354XcyPo1Xg5hlBQ5YT6hxzic34RVx5zYvKPJU_CLVHoA08',
    badge: 'Daily Challenge',
    rating: 5,
  };

  const games = [
    {
      id: 'zakovat-quiz',
      title: t('games.zakovat_quiz.title'),
      category: t('games.zakovat_quiz.category'),
      rating: 4.9,
      image: 'https://cdn.zakovatklubi.uz/uploads/z4/m_VbgjJurxScWzqoWfLqn69om7KJe3UD.jpg',
    },
    {
      id: 'zakovat-minutka',
      title: t('games.zakovat_minutka.title'),
      category: t('games.zakovat_minutka.category'),
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
                <Text className="pt-1 text-sm leading-none text-gray-500">
                  {t('common.online')}
                </Text>
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
            onPlayGame={(id) => router.push(`/game/${id}` as Href)}
            onPlayRecent={(id) => console.log('Play recent', id)}
            onViewAllRecent={() => console.log('View all recent')}
          />
        </View>
      </SafeArea>
    </View>
  );
}
