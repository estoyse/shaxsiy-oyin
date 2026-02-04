import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
