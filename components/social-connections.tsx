import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Image, Platform, View } from 'react-native';
import { useUniwind } from 'uniwind';
import { Text } from './ui/text';

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: 'oauth_apple',
    source: { uri: 'https://img.clerk.com/static/apple.png?width=160' },
    useTint: true,
    name: 'Apple',
  },
  {
    type: 'oauth_google',
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
    name: 'Google',
  },
  // {
  //   type: 'oauth_facebook',
  //   source: { uri: 'https://img.clerk.com/static/facebook.png?width=160' },
  //   useTint: false,
  // },
];

export function SocialConnections() {
  const { theme } = useUniwind();

  return (
    <View className="w-full flex-row gap-2">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            className="h-14 flex-1 flex-row items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5"
            onPress={() => {
              // TODO: Authenticate with social provider and navigate to protected screen if successful
            }}>
            <Image
              className={cn('size-4', strategy.useTint && Platform.select({ web: 'dark:invert' }))}
              tintColor={Platform.select({
                native: strategy.useTint ? (theme === 'dark' ? 'white' : 'black') : undefined,
              })}
              source={strategy.source}
            />
            <Text className="font-semibold text-white">{strategy.name}</Text>
          </Button>
        );
      })}
    </View>
  );
}
