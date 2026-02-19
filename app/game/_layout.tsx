import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]/result" options={{ headerShown: false }} />
    </Stack>
  );
}
