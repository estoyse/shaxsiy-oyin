import React from 'react';
import { View, ScrollView } from 'react-native';

import { Crown, TrendingUp, BarChart3, CheckCircle2, XCircle, Zap } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SafeArea from '@/components/safeArea';
import { router } from 'expo-router';

interface Player {
  id: string;
  name: string;
  avatar: string;
  points: number;
  accuracy: number;
  rank: number;
  eloChange?: number;
  isCurrentUser?: boolean;
}

interface PerformanceStats {
  correct: number;
  wrong: number;
  buzzWins: number;
}

const players = [
  {
    id: '1',
    name: 'Alex',
    avatar: 'https://picsum.photos/seed/alex/200',
    points: 12450,
    accuracy: 98,
    rank: 1,
    eloChange: 18,
  },
  {
    id: '2',
    name: 'Sarah',
    avatar: 'https://picsum.photos/seed/sarah/200',
    points: 11200,
    accuracy: 92,
    rank: 2,
  },
  {
    id: '3',
    name: 'Mike',
    avatar: 'https://picsum.photos/seed/mike/200',
    points: 10850,
    accuracy: 88,
    rank: 3,
  },
  {
    id: '4',
    name: 'You',
    avatar: 'https://picsum.photos/seed/user/200',
    points: 9100,
    accuracy: 75,
    rank: 4,
    isCurrentUser: true,
  },
];

export default function FinalLeaderboard() {
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500';
      case 2:
        return 'bg-slate-400';
      case 3:
        return 'bg-[#CD7F32]';
      default:
        return 'bg-slate-600';
    }
  };

  const renderPlayer = (player: Player) => {
    const isWinner = player.rank === 1;
    const isCurrentUser = player.isCurrentUser;

    if (isWinner) {
      return (
        <View className="p-4 pb-0">
          <View
            key={player.id}
            className={cn(
              'relative rounded-[20px] border-2 border-amber-500 p-4',
              'bg-card scale-[1.02] transform shadow-lg'
            )}>
            {/* Elo Badge */}
            {player.eloChange && (
              <View className="absolute -top-3 right-4 flex-row items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 shadow-lg">
                <TrendingUp size={11} color="#0F172A" />
                <Text className="text-[11px] font-bold text-[#0F172A]">
                  +{player.eloChange} Elo
                </Text>
              </View>
            )}

            <View className="flex-row items-center gap-4">
              {/* Avatar with Gold Ring */}
              <View className="relative">
                <View className="h-14 w-14 rounded-full bg-gradient-to-b from-amber-500 to-orange-700 p-[2px]">
                  <Avatar alt={player.name} className="border-card h-full w-full border-2">
                    <AvatarImage source={{ uri: player.avatar }} />
                    <AvatarFallback>
                      <Text className="text-xl font-bold">
                        {player.name.charAt(0).toUpperCase()}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                </View>

                {/* Rank Badge */}
                <View className="border-card absolute -right-1 -bottom-1 h-6 w-6 items-center justify-center rounded-full border-2 bg-amber-500">
                  <Text className="text-xs font-bold text-[#1E293B]">{player.rank}</Text>
                </View>
              </View>

              {/* Player Info */}
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-foreground text-[19px] font-bold">{player.name}</Text>
                  <Crown size={18} color="#F59E0B" />
                </View>
                <Text className="text-muted-foreground text-sm font-medium">
                  {player.points.toLocaleString()} pts
                </Text>
              </View>

              {/* Accuracy */}
              <View>
                <Text className="text-foreground text-2xl font-black">{player.accuracy}%</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    // Regular player row
    return (
      <View
        key={player.id}
        className={cn(
          'mx-3 flex-row items-center gap-3 rounded-2xl p-3',
          'bg-card border',
          isCurrentUser
            ? 'border-slate-800 bg-slate-800/50 opacity-80'
            : player.rank === 2
              ? 'border-slate-600'
              : 'border-slate-700/50'
        )}>
        {/* Avatar */}
        <View className="relative">
          <Avatar
            alt={player.name}
            className={cn('h-12 w-12 bg-slate-700', isCurrentUser && 'opacity-80 grayscale')}>
            <AvatarImage source={{ uri: player.avatar }} />
            <AvatarFallback>
              <Text className="text-lg font-bold">{player.name.charAt(0).toUpperCase()}</Text>
            </AvatarFallback>
          </Avatar>

          {/* Rank Badge */}
          <View
            className={cn(
              'border-card absolute -right-1 -bottom-1 h-5 w-5 items-center justify-center rounded-full border-2',
              getRankBadgeColor(player.rank)
            )}>
            <Text className="text-[10px] font-bold text-white">{player.rank}</Text>
          </View>
        </View>

        {/* Player Info */}
        <View className="flex-1">
          <Text
            className={cn(
              'text-[17px] font-semibold',
              isCurrentUser ? 'text-slate-400' : 'text-slate-200'
            )}>
            {player.name}
          </Text>
          <Text
            className={cn(
              'text-xs font-medium',
              isCurrentUser ? 'text-slate-600' : 'text-slate-500'
            )}>
            {player.points.toLocaleString()} pts
          </Text>
        </View>

        {/* Accuracy */}
        <View className="px-2">
          <Text
            className={cn(
              'text-lg font-bold',
              isCurrentUser ? 'text-slate-500' : 'text-slate-300'
            )}>
            {player.accuracy}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeArea>
      <View className="bg-background flex-1">
        <View className="flex-1 justify-between px-5 pb-2">
          {/* Header */}
          <View className="items-center pt-2 pb-6">
            <Text className="text-foreground text-[32px] font-black tracking-tight uppercase">
              O'yin tugadi!
            </Text>
            <Text className="text-muted-foreground mt-1 text-[15px] font-medium">
              xxx nomli o'yin o'z nihoyasiga yetdi
            </Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-6 gap-6"
            showsVerticalScrollIndicator={false}>
            {/* Leaderboard List */}
            <View className="gap-3">{players.map((player) => renderPlayer(player))}</View>

            {/* Performance Card */}
            <View className="mt-4">
              <View className="bg-card relative h-[140px] justify-center overflow-hidden rounded-[20px] border-t border-white/5 p-5">
                {/* Background Decoration */}
                <View className="bg-primary absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full opacity-[0.03] blur-2xl" />

                {/* Header */}
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <BarChart3 size={15} color="#6366F1" />
                    <Text className="text-foreground text-[15px] font-semibold">
                      Your Performance
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View className="flex-1 flex-row gap-3">
                  {/* Left Column: Correct/Wrong */}
                  <View className="flex-1 justify-center gap-2">
                    {/* Correct */}
                    <View className="flex-row items-center justify-between rounded-lg border border-white/5 bg-slate-800/50 p-2 px-3">
                      <Text className="text-xs font-medium text-slate-400">Correct</Text>
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-sm font-bold text-green-500">2</Text>
                        <CheckCircle2 size={14} color="#22C55E" />
                      </View>
                    </View>

                    {/* Wrong */}
                    <View className="flex-row items-center justify-between rounded-lg border border-white/5 bg-slate-800/50 p-2 px-3">
                      <Text className="text-xs font-medium text-slate-400">Wrong</Text>
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-destructive text-sm font-bold">2</Text>
                        <XCircle size={14} color="#EF4444" />
                      </View>
                    </View>
                  </View>

                  {/* Right Column: Buzz Wins */}
                  <View className="flex-1 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2">
                    <Zap size={24} color="#8B5CF6" className="mb-1" />
                    <Text className="text-foreground text-2xl leading-none font-black">2</Text>
                    <Text className="mt-1 text-[10px] font-bold tracking-wide text-indigo-300 uppercase">
                      Buzz Wins
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="mt-auto gap-3 pt-2 pb-2">
            <Button
              variant="outline"
              size="lg"
              className="h-[52px] rounded-2xl border-2"
              onPress={() => {
                router.back();
              }}>
              <Text className="text-secondary-foreground text-[17px] font-semibold">EXIT</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeArea>
  );
}
