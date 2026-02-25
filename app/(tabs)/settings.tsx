import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import SafeArea from '@/components/safeArea';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Icon } from '@/components/ui/icon';
import {
  Languages,
  Moon,
  Sun,
  Monitor,
  LogOut,
  ChevronRight,
  Bell,
  ShieldCheck,
  Info,
  Heart,
  MessageSquare,
  Volume2,
} from 'lucide-react-native';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
import { useUniwind, Uniwind } from 'uniwind';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner-native';

export default function SettingsScreen() {
  const [lang, setLang] = useState('uz');

  const { user, logout } = useAuthStore();

  const { theme, hasAdaptiveThemes } = useUniwind();

  const themes = [
    { name: 'light', label: 'Light', icon: Sun },
    { name: 'dark', label: 'Dark', icon: Moon },
    { name: 'system', label: 'System', icon: Monitor },
  ];
  const activeTheme = hasAdaptiveThemes ? 'system' : theme;

  const handleLogout = async () => {
    Alert.alert('Chiqish', 'Haqiqatan ham tizimdan chiqmoqchimisiz?', [
      {
        text: 'Bekor qilish',
        style: 'cancel',
      },
      {
        text: 'Chiqish',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            toast.error(error.message);
          } else {
            logout();
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeArea edges={['top']}>
        <View className="px-6 pt-4 pb-2">
          <Text className="font-dm-bold text-3xl">Sozlamalar</Text>
          <Text className="text-muted-foreground text-sm">Ilovani o'zingizga moslang</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          {/* User Profile Card */}
          <Card className="bg-primary/5 mb-6 overflow-hidden border-none">
            <CardContent className="flex-row items-center gap-4 py-6">
              <Avatar
                alt={user?.user_metadata?.full_name || 'User Avatar'}
                className="size-16 border-2 border-white/20">
                <AvatarImage source={{ uri: user?.user_metadata?.avatar_url }} />
                <AvatarFallback>
                  <Text className="text-primary text-xl font-bold">
                    {user?.email?.[0].toUpperCase() ?? 'U'}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <View className="flex-1">
                <Text className="text-xl font-bold">
                  {user?.user_metadata?.full_name || 'Foydalanuvchi'}
                </Text>
                <Text className="text-muted-foreground text-sm">{user?.email}</Text>
              </View>
              <TouchableOpacity className="bg-background/80 size-10 items-center justify-center rounded-full border border-white/10">
                <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
              </TouchableOpacity>
            </CardContent>
          </Card>

          {/* General Section */}
          <SettingSection title="Umumiy">
            <SettingItem icon={Languages} title="Til" description="Ilova tilini tanlang">
              <ToggleGroup
                value={lang}
                onValueChange={(val) => {
                  if (val) setLang(val as string);
                }}
                variant="outline"
                type="single">
                <ToggleGroupItem isFirst value="uz">
                  <Text className="text-xs">UZ</Text>
                </ToggleGroupItem>
                <ToggleGroupItem value="en">
                  <Text className="text-xs">EN</Text>
                </ToggleGroupItem>
                <ToggleGroupItem isLast value="ru">
                  <Text className="text-xs">RU</Text>
                </ToggleGroupItem>
              </ToggleGroup>
            </SettingItem>

            <Separator className="bg-border/50 my-1" />

            <SettingItem icon={Monitor} title="Mavzu" description="Ko'rinishni o'zgartirish">
              <ToggleGroup
                value={activeTheme}
                onValueChange={(val) => {
                  Uniwind.setTheme(val as any);
                }}
                variant="outline"
                type="single">
                {themes.map((theme, index) => (
                  <ToggleGroupItem
                    key={theme.name}
                    value={theme.name}
                    isFirst={index === 0}
                    isLast={index === themes.length - 1}>
                    <Icon as={theme.icon} size={14} />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </SettingItem>
          </SettingSection>

          {/* Preferences Section */}
          <SettingSection title="Afzalliklar">
            <SettingActionItem icon={Bell} title="Bildirishnomalar" />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={Volume2} title="Ovoz effektlari" />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={ShieldCheck} title="Xavfsizlik va Maxfiylik" />
          </SettingSection>

          {/* Support Section */}
          <SettingSection title="Yordam va Aloqa">
            <SettingActionItem icon={MessageSquare} title="Yordam markazi" />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={Heart} title="Ilovani baholang" />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={Info} title="Ilova haqida" description="Versiya 1.0.0" />
          </SettingSection>

          {/* Logout Section */}
          <View className="mt-2 mb-10 px-1">
            <Button
              variant="destructive"
              className="h-14 flex-row items-center justify-center gap-2 rounded-2xl shadow-lg shadow-red-500/20"
              onPress={handleLogout}>
              <Icon as={LogOut} size={20} color="white" />
              <Text className="text-lg font-bold text-white">Tizimdan chiqish</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeArea>
    </>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="text-muted-foreground mb-3 ml-1 text-xs font-bold tracking-wider uppercase">
        {title}
      </Text>
      <Card className="bg-card overflow-hidden p-0">
        <CardContent className="px-4 py-0">{children}</CardContent>
      </Card>
    </View>
  );
}

function SettingItem({
  icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 flex-row items-center gap-4">
        <View className="bg-primary/10 size-11 items-center justify-center rounded-2xl">
          <Icon as={icon} size={22} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text className="text-lg leading-tight font-bold">{title}</Text>
          {description && (
            <Text className="text-muted-foreground mt-0.5 text-xs font-medium">{description}</Text>
          )}
        </View>
      </View>
      <View>{children}</View>
    </View>
  );
}

function SettingActionItem({
  icon,
  title,
  description,
  onPress,
}: {
  icon: any;
  title: string;
  description?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 active:opacity-60">
      <View className="flex-1 flex-row items-center gap-4">
        <View className="bg-muted size-11 items-center justify-center rounded-2xl">
          <Icon as={icon} size={22} className="text-foreground" />
        </View>
        <View className="flex-1">
          <Text className="text-lg leading-tight font-bold">{title}</Text>
          {description && (
            <Text className="text-muted-foreground mt-0.5 text-xs font-medium">{description}</Text>
          )}
        </View>
      </View>
      <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}
