import SafeArea from '@/components/safeArea';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSocket } from '@/providers/socketProvider';
import { useFocusEffect } from 'expo-router';
import { ClockIcon, Users2Icon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

export default function ActiveGames() {
  const { socket } = useSocket();
  // TODO: change type
  const [games, setGames] = useState<any[]>([]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      if (!socket) {
        toast.error('Connection error. Please try again later');
        return;
      }
      socket.emit('GET_ROOM_LIST');
      socket.on('ROOM_LIST', (data) => {
        console.log(data);
        setGames(data);
      });

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        socket.off('ROOM_LIST');
      };
    }, [socket])
  );

  return (
    <SafeArea edges={['top']}>
      <View>
        <View className="border-b border-gray-600/50 p-4 py-2">
          <Text className="font-dm-bold text-xl">Aktiv O'yinlar</Text>
          <Text className="text-muted-foreground">{games.length}ta o'yin davom etmoqda</Text>
        </View>
        <ScrollView
          className="gap-2"
          contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 8, paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}>
          {games.map((game) => (
            <Pressable
              key={game.id}
              // onPress={() => router.push(`/game/${game.id}`)}
              className="active:opacity-95">
              {({ pressed }) => (
                <Card>
                  <CardContent className="p-4">
                    {/* Game Header */}
                    <View className="mb-3 flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-primary mb-1 text-lg font-semibold">{game.name}</Text>
                        <Text className="text-muted-foreground text-sm">{game.gameType}</Text>
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
                          {game.roundsLeft}ta mavzu qoldi
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
                              ((game.totalRounds - game.roundsLeft) / game.totalRounds) * 100
                            }%`,
                          }}
                        />
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeArea>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 'in-progress':
      return 'bg-green-500/10 border-green-500/20';
    case 'final-round':
      return 'bg-red-500/10 border-red-500/20';
    default:
      return 'bg-gray-500/10 border-gray-500/20';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'WAITING':
      return 'text-yellow-500';
    case 'IN_PROGRESS':
      return 'text-green-500';
    case 'FINAL_ROUND':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'WAITING':
      return 'Boshlanmoqda';
    case 'in-progress':
      return "O'tkazilmoqda";
    case 'final-round':
      return 'Oxirgi mavzu';
    default:
      return status;
  }
};
