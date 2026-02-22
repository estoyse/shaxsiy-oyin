import SafeArea from '@/components/safeArea';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { useSocket } from '@/providers/socketProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { GameState } from '@/types/game';
import Slider from '@react-native-community/slider';
import { router, useFocusEffect } from 'expo-router';
import { ClockIcon, Info, PlusIcon, Users2Icon } from 'lucide-react-native';
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

export default function ShaxshiyOyinScreen() {
  const [value, setValue] = useState('list');
  const { socket, isConnected } = useSocket();
  const [games, setGames] = useState<GameRoom[]>([]);

  const [roomName, setRoomName] = useState('');
  const [categoriesCount, setCategoriesCount] = useState(2);

  const { session } = useAuthStore();

  const handleCreateGame = async () => {
    if (!socket || !isConnected) {
      console.warn('Socket not connected');
      return;
    }

    if (!session?.access_token) {
      console.error('No auth token found');
      return;
    }

    socket.emit('CREATE_ROOM', {
      token: session.access_token,
      name: roomName,
      categoriesCount,
    });

    socket.once('ROOM_CREATED', (data: { roomId: string }) => {
      console.log('Room created:', data.roomId);
      router.push(`/game/room/${data.roomId}`);
    });

    socket.once('ERROR', (error: { message: string }) => {
      console.error('Room creation error:', error.message);
    });
  };

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
      <Tabs value={value} onValueChange={setValue} className="flex-1 p-4">
        <TabsList className="w-full">
          <TabsTrigger value="list" className="w-1/2">
            <Text>Aktiv o'yinlar</Text>
          </TabsTrigger>
          <TabsTrigger value="newGame" className="w-1/2">
            <Text>Yangi o'yin</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="flex-1">
          <ScrollView
            className="flex-1 gap-2"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 16, gap: 8, paddingBottom: 96 }}>
            {games.length > 0 ? (
              games.map((game) => (
                <Pressable
                  key={game.id}
                  onPress={() => router.push(`/game/room/${game.id}`)}
                  className="active:opacity-95">
                  <Card className="transition-all duration-100 active:scale-96 active:opacity-95">
                    <CardContent className="p-4">
                      {/* Game Header */}
                      <View className="mb-3 flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text className="text-primary mb-1 text-lg font-semibold">
                            {game.name}
                          </Text>
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
              ))
            ) : (
              <View className="h-full flex-1 items-center justify-center pt-24">
                <Icon as={Info} size={36} className="text-muted-foreground" />
                <Text className="text-muted-foreground pt-2 text-lg">O'yinlar topilmadi</Text>
              </View>
            )}
          </ScrollView>
        </TabsContent>
        <TabsContent value="newGame" className="flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="p-4">
            <Card>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Text>O'yin nomi</Text>
                  <Input
                    placeholder="masalan: Choyxona"
                    placeholderTextColor="#fff8"
                    value={roomName}
                    onChangeText={setRoomName}
                  />
                </View>
                <View className="gap-2">
                  <Text>Mavzular soni: {categoriesCount}</Text>
                  <Slider
                    minimumValue={2}
                    maximumValue={20}
                    step={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    onValueChange={setCategoriesCount}
                  />
                </View>
              </CardContent>
            </Card>
          </ScrollView>
          <View className="p-4">
            <Pressable
              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-indigo-500 active:translate-y-1"
              onPress={handleCreateGame}
              style={{
                boxShadow: '0px 4px 0px #4338ca',
              }}>
              <Icon as={PlusIcon} size={20} color="#FFFFFF" />
              <Text className="font-bold text-white">Yangi o'yin</Text>
            </Pressable>
            {/* <Button
              onPress={handleCreateGame}
              className="h-16 rounded-full border-2 border-sky-300 bg-sky-100 transition-colors duration-100 active:bg-sky-200 dark:border-sky-700 dark:bg-sky-500 dark:active:bg-sky-400">
              <Icon
                as={PlusIcon}
                size={24}
                className="text-primary-foreground light:text-primary"
              />
              <Text className="light:text-primary text-xl">Yangi o'yin</Text>
            </Button> */}
          </View>
        </TabsContent>
      </Tabs>
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
