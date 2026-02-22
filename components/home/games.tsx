import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';

import { PlayCircle, Star, Play } from 'lucide-react-native';
import { Text } from '../ui/text';
interface Game {
  id: string;
  title: string;
  category: string;
  rating: number;
  image: string;
  isHot?: boolean;
}

interface FeaturedGame {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  rating: number;
}

interface RecentGame {
  id: string;
  title: string;
  level: number;
  progress: number;
  image: string;
}

interface ArcadeScreenProps {
  featuredGame: FeaturedGame;
  games: Game[];
  recentGame: RecentGame;
  walletBalance: number;
  onBack: () => void;
  onPlayFeatured: (id: string) => void;
  onPlayGame: (id: string) => void;
  onPlayRecent: (id: string) => void;
  onViewAllRecent: () => void;
}

const categories = ['All', 'Brain Teasers', 'Action', 'Trivia', 'Card Games'];

export default function ArcadeScreen({
  featuredGame,
  games,
  recentGame,
  onPlayFeatured,
  onPlayGame,
  onPlayRecent,
  onViewAllRecent,
}: ArcadeScreenProps) {
  const StarRating = ({ rating }: { rating: number }) => (
    <View className="flex-row">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < Math.floor(rating) ? '#F59E0B' : 'transparent'}
          color="#F59E0B"
        />
      ))}
    </View>
  );

  return (
    <ScrollView
      className="flex-1 px-6 py-2"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-8">
      {/* Featured Card */}
      <Pressable
        className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl active:opacity-95"
        onPress={() => onPlayFeatured(featuredGame.id)}>
        <Image
          source={{ uri: featuredGame.image }}
          className="absolute inset-0 h-full w-full opacity-60"
          resizeMode="cover"
        />
        <View className="from-background via-background/40 absolute inset-0 bg-linear-to-t to-transparent" />

        <View className="absolute right-0 bottom-0 left-0 p-5">
          <View className="mb-2 flex-row items-center gap-2">
            <View className="rounded border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5">
              <Text className="text-[10px] font-bold tracking-wider text-indigo-300 uppercase">
                {featuredGame.badge}
              </Text>
            </View>
            <StarRating rating={featuredGame.rating} />
          </View>

          <Text className="mb-1 text-2xl font-bold">{featuredGame.title}</Text>
          <Text className="mb-4 text-sm text-slate-300" numberOfLines={1}>
            {featuredGame.description}
          </Text>

          <Pressable
            className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-indigo-500 active:translate-y-1"
            style={{
              boxShadow: '0px 4px 0px #4338ca',
            }}
            onPress={() => onPlayGame(featuredGame.id)}>
            <PlayCircle size={20} color="#FFFFFF" />
            <Text className="font-bold text-white">Play Now</Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Search & Filter
      Turn off for now, the games are not that many so, we will turn it on when we have more games
      {/* <View className="mb-8 gap-4">

        <View className="relative">
          <Search
            size={20}
            color="#94A3B8"
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2"
            style={{ position: 'absolute', left: 16, top: 14 }}
          />
          <TextInput
            placeholder="Find a game..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/50 pr-4 pl-12 text-sm text-white"
          />
        </View>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
          contentContainerClassName="gap-3 pb-2">
          {categories.map((category) => (
            <Pressable
              key={category}
              className={cn(
                'rounded-full px-5 py-2',
                selectedCategory === category
                  ? 'bg-slate-50'
                  : 'border border-slate-700 bg-slate-800'
              )}
              onPress={() => setSelectedCategory(category)}>
              <Text
                className={cn(
                  'text-sm font-semibold',
                  selectedCategory === category ? 'text-slate-900' : 'text-slate-300'
                )}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View> */}

      {/* Games Grid */}
      <View className="mb-4 flex-row flex-wrap gap-4">
        {games.map((game) => (
          <Pressable
            key={game.id}
            className="w-[47.5%] rounded-2xl border border-slate-700/50 bg-slate-800 p-3 active:scale-95"
            onPress={() => onPlayGame(game.id)}>
            {/* Game Image */}
            <View className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-slate-900">
              <Image source={{ uri: game.image }} className="h-full w-full" resizeMode="cover" />

              {/* Hot Badge */}
              {game.isHot && (
                <View className="absolute top-0 left-0 rounded-br-lg bg-red-500 px-2 py-1">
                  <Text className="text-[10px] font-bold text-white">HOT</Text>
                </View>
              )}

              {/* Rating Badge */}
              <View className="absolute top-2 right-2 flex-row items-center gap-1 rounded bg-slate-900/80 px-2 py-0.5 backdrop-blur">
                <Star size={10} fill="#F59E0B" color="#F59E0B" />
                <Text className="text-[10px] font-bold text-amber-400">{game.rating}</Text>
              </View>
            </View>

            {/* Game Info */}
            <Text className="mb-1 text-base leading-tight font-bold">{game.title}</Text>
            <Text className="mb-3 text-xs text-slate-400">{game.category}</Text>

            {/* Start Button */}
            <Pressable
              className="h-8 w-full flex-row items-center justify-center gap-2 rounded-sm bg-indigo-500 active:translate-y-0.5"
              style={{
                boxShadow: '0px 3px 0px #4338ca',
              }}
              onPress={() => onPlayGame(game.id)}>
              <PlayCircle size={16} color="#FFFFFF" />
              <Text className="font-bold text-white">Play Now</Text>
            </Pressable>
          </Pressable>
        ))}
      </View>

      {/* Recently Played Section */}
      <View className="mt-6">
        <View className="mb-4 flex-row items-end justify-between">
          <Text className="text-lg font-bold">Recently Played</Text>
          <Pressable onPress={onViewAllRecent}>
            <Text className="text-xs font-medium text-indigo-400">View All</Text>
          </Pressable>
        </View>

        <Pressable
          className="flex-row items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800 p-4"
          onPress={() => onPlayRecent(recentGame.id)}>
          <Image
            source={{ uri: recentGame.image }}
            className="h-12 w-12 rounded-lg bg-slate-900"
            resizeMode="cover"
          />

          <View className="flex-1">
            <Text className="mb-2 text-sm font-bold">{recentGame.title}</Text>

            {/* Progress Bar */}
            <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
              <View
                className="h-1.5 rounded-full bg-green-500"
                style={{ width: `${recentGame.progress}%` }}
              />
            </View>

            <Text className="mt-1 text-[10px] text-slate-400">
              Lvl {recentGame.level} • {recentGame.progress}% Completed
            </Text>
          </View>

          <Pressable className="h-8 w-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/20">
            <Play size={14} color="#818CF8" fill="#818CF8" />
          </Pressable>
        </Pressable>
      </View>

      {/* Bottom Spacer */}
      <View className="h-[34px]" />
    </ScrollView>
  );
}
