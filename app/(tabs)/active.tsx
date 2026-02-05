import SafeArea from '@/components/safeArea';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSocket } from '@/providers/socketProvider';
import { GameState } from '@/types/game';
import { router, useFocusEffect } from 'expo-router';
import { ClockIcon, Users2Icon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

interface GameRoom {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  isPrivate: boolean;
  categoriesCount: number;
  gameState: GameState;
  questionIndex: number;
  questionsCount: number;
  categoryLeftCount: number;
}

export default function ActiveGames() {
  const { socket } = useSocket();
  const [games, setGames] = useState<GameRoom[]>([]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      if (!socket) {
        toast.error('Connection error. Please try again later');
        return;
      }
      socket.emit('GET_ROOM_LIST');
      socket.on('ROOM_LIST', (data) => {
        setGames(
          data.map((game: GameRoom) => ({
            ...game,
            categoryLeftCount: getCategoryLeftCount(game),
          }))
        );
      });

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        socket.off('ROOM_LIST');
      };
    }, [socket])
  );

  return (
    <SafeArea edges={['top']}>
      <View className="flex-1">
        <View className="border-b border-gray-600/50 p-4 py-2">
          <Text className="font-dm-bold text-xl">Aktiv O'yinlar</Text>
          <Text className="text-muted-foreground">{games.length}ta o'yin davom etmoqda</Text>
        </View>
        <ScrollView
          className="flex-1 gap-2"
          contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 8, paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}>
          {games.map((game) => (
            <Pressable
              key={game.id}
              onPress={() => router.push(`/game/room/${game.id}`)}
              className="active:opacity-95">
              <Card className="transition-all duration-100 active:scale-96 active:opacity-95">
                <CardContent className="p-4">
                  {/* Game Header */}
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-primary mb-1 text-lg font-semibold">{game.name}</Text>
                    </View>
                    <View
                      className={`rounded-full border px-3 py-1 ${getStatusColor(game.gameState)}`}>
                      <Text className={`text-sm ${getStatusTextColor(game.gameState)}`}>
                        {getStatusText(game.gameState)}
                      </Text>
                    </View>
                  </View>

                  {/* Game Stats */}
                  <View className="flex-row items-center gap-4">
                    {/* Players */}
                    <View className="flex-row items-center gap-1.5">
                      <Icon as={Users2Icon} size={16} className="text-muted-foreground" />
                      <Text className="text-muted-foreground font-medium">
                        {game.playerCount}/{game.maxPlayers} ishtirokchi
                      </Text>
                    </View>

                    {/* Rounds Left */}
                    <View className="flex-row items-center gap-1.5">
                      <Icon as={ClockIcon} size={16} className="text-muted-foreground" />
                      <Text className="text-muted-foreground">
                        {game.categoryLeftCount}
                        ta mavzu qoldi
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="mt-3">
                    <View className="mb-1 flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">Holati</Text>
                    </View>
                    <View className="bg-muted h-1.5 overflow-hidden rounded-full">
                      <View
                        className="bg-muted-foreground h-full"
                        style={{
                          width: `${
                            ((game.categoriesCount - game.categoryLeftCount) /
                              game.categoriesCount) *
                            100
                          }%`,
                        }}
                      />
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeArea>
  );
}

const getStatusColor = (status: GameState) => {
  switch (status) {
    case 'WAITING':
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 'SCRAMBLE':
      return 'bg-green-500/10 border-green-500/20';
    case 'ENDED':
      return 'bg-red-500/10 border-red-500/20';
    default:
      return 'bg-gray-500/10 border-gray-500/20';
  }
};

const getStatusTextColor = (status: GameState) => {
  switch (status) {
    case 'WAITING':
      return 'text-yellow-500';
    case 'SCRAMBLE':
      return 'text-green-500';
    case 'ENDED':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusText = (status: GameState) => {
  switch (status) {
    case 'WAITING':
      return 'Boshlanmoqda';
    case 'SCRAMBLE':
      return "O'tkazilmoqda";
    case 'ENDED':
      return 'Tugadi';
    default:
      return status;
  }
};

const getCategoryLeftCount = (data: GameRoom) => {
  if (data.gameState === 'WAITING') return data.categoriesCount;
  return Math.ceil((data.questionsCount - data.questionIndex) / 5);
};
