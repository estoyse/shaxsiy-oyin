import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function Screen() {
  return (
    <>
      <View className="h-full items-center justify-center">
        <Link href="/auth/login" className="text-blue-500">
          <Text> Login</Text>
        </Link>
      </View>
    </>
  );
}
