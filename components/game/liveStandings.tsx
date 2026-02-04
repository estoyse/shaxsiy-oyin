import { Image, View } from 'react-native';
import { Text } from '../ui/text';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, useRef } from 'react';
import { Player } from '@/types/game';

export default function LiveStandings({ players }: { players: Player[] }) {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['15%', '50%'], []);
  if (!players) return null;
  return (
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
        <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          {players.map((player, index) => (
            <View
              key={player.id}
              className={`h-14 flex-row items-center justify-between ${
                index < players.length - 1 ? 'border-border/50 border-b' : ''
              } opacity-80`}>
              {/* Left Side - Avatar and Info */}
              <View className="flex-row items-center gap-3">
                <View className="relative">
                  <Image
                    source={{ uri: player.avatar }}
                    className={`h-10 w-10 rounded-full ${
                      player.id === 'me' ? 'border-primary border-2' : ''
                    }`}
                    style={
                      player.id !== 'me' && {
                        opacity: 0.7,
                      }
                    }
                  />
                  {/* Online Status Indicator */}
                  <View
                    className={`border-card absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 ${
                      player.isConnected ? 'bg-chart-2' : 'bg-muted-foreground'
                    }`}
                  />
                </View>

                <View>
                  {player.id === 'me' ? (
                    <>
                      <Text className="text-primary text-[15px] font-semibold">{player.name}</Text>
                      {player.isBannedFromQuestion && (
                        <Text className="text-primary text-[11px]">You guessed wrong</Text>
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
                    player.id === 'me'
                      ? 'text-accent-foreground font-bold'
                      : 'text-muted-foreground font-semibold'
                  }`}>
                  {player.score}
                </Text>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
}
