import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import { Uniwind, useUniwind } from 'uniwind';

Uniwind.setTheme('system');

const SCREEN_OPTIONS = {
  title: 'React Native Reusables',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Button
          onPress={() => toast.info('Hello, World!', { closeButton: true })}
          className="ios:size-9 web:mx-4 rounded-full"
          variant={'ghost'}>
          <Icon as={StarIcon} className="size-5" />
        </Button>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { theme } = useUniwind();

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    Uniwind.setTheme(newTheme);
  }

  return (
    <Button
      onPressIn={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 web:mx-4 rounded-full">
      <Icon as={THEME_ICONS[theme ?? 'light']} className="size-5" />
    </Button>
  );
}
