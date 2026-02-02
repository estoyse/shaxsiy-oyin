import SafeArea from '@/components/safeArea';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ClockIcon, Users2Icon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

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

export default function ActiveGames() {
  return (
    <SafeArea edges={['top']}>
      <View>
        <View className="border-b border-gray-600/50 p-4 py-2">
          <Text className="font-dm-bold text-xl">Aktiv O'yinlar</Text>
          <Text className="text-muted-foreground">{activeGames.length}ta o'yin davom etmoqda</Text>
        </View>
        <ScrollView
          className="gap-2"
          contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 8, paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}>
          {activeGames.map((game) => (
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
                        className={`rounded-full border px-3 py-1 ${getStatusColor(game.status)}`}>
                        <Text className={`text-sm ${getStatusTextColor(game.status)}`}>
                          {getStatusText(game.status)}
                        </Text>
                      </View>
                    </View>

                    {/* Game Stats */}
                    <View className="flex-row items-center gap-4">
                      {/* Players */}
                      <View className="flex-row items-center gap-1.5">
                        <Icon as={Users2Icon} size={16} className="text-muted-foreground" />
                        <Text className="text-muted-foreground font-medium">
                          {game.players}/{game.maxPlayers} ishtirokchi
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
                        <Text className="text-muted-foreground text-xs">
                          {game.totalRounds - game.roundsLeft}/{game.totalRounds}
                        </Text>
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
    case 'waiting':
      return 'text-yellow-500';
    case 'in-progress':
      return 'text-green-500';
    case 'final-round':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'Boshlanmoqda';
    case 'in-progress':
      return "O'tkazilmoqda";
    case 'final-round':
      return 'Oxirgi mavzu';
    default:
      return status;
  }
};
