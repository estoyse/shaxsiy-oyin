import SafeArea from '@/components/safeArea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { useSocket } from '@/providers/socketProvider';
import { useAuthStore } from '@/store/useAuthStore';

export default function NewGame() {
  const [roomName, setRoomName] = useState('');
  const [categoriesCount, setCategoriesCount] = useState(2);

  const { socket, isConnected } = useSocket();
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
      router.replace(`/game/room/${data.roomId}`);
    });

    socket.once('ERROR', (error: { message: string }) => {
      console.error('Room creation error:', error.message);
    });
  };
  return (
    <View className="bg-background flex-1">
      <SafeArea>
        <View className="flex-row items-center justify-between px-2">
          <Button
            onPress={() => router.back()}
            variant="ghost"
            className="aspect-square size-12 rounded-full">
            <Icon as={ArrowLeftIcon} size={24} className="text-primary" />
          </Button>

          <Text className="text-2xl font-bold">Yangi o'yin</Text>
          <Button variant="ghost" className="aspect-square size-12 rounded-full opacity-0">
            <Icon as={ArrowLeftIcon} size={24} className="text-primary" />
          </Button>
        </View>
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
          <Button
            onPress={handleCreateGame}
            className="h-16 rounded-full border-2 border-sky-300 bg-sky-100 transition-colors duration-100 active:bg-sky-200 dark:border-sky-700 dark:bg-sky-500 dark:active:bg-sky-400">
            <Icon as={PlusIcon} size={24} className="text-primary-foreground light:text-primary" />
            <Text className="light:text-primary text-xl">Yangi o'yin</Text>
          </Button>
        </View>
      </SafeArea>
    </View>
  );
}
