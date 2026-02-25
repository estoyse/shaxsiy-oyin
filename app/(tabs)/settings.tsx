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
import { useUniwind, Uniwind } from 'uniwind';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme, hasAdaptiveThemes } = useUniwind();

  const themes = [
    { name: 'light', label: t('themes.light'), icon: Sun },
    { name: 'dark', label: t('themes.dark'), icon: Moon },
    { name: 'system', label: t('themes.system'), icon: Monitor },
  ];

  const activeTheme = hasAdaptiveThemes ? 'system' : theme;

  const handleLanguageChange = async (newLang: string | undefined) => {
    if (newLang) {
      await i18n.changeLanguage(newLang);
      await AsyncStorage.setItem('user-language', newLang);
    }
  };

  const handleLogout = async () => {
    Alert.alert(t('settings.logout_confirm_title'), t('settings.logout_confirm_desc'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.logout'),
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
          <Text className="font-dm-bold text-3xl">{t('common.settings')}</Text>
          <Text className="text-muted-foreground text-sm">{t('settings.subtitle')}</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          {/* User Profile Card */}
          <Card className="bg-primary/5 mb-6 overflow-hidden border-none">
            <CardContent className="flex-row items-center gap-4 py-6">
              <Avatar
                alt={user?.user_metadata?.full_name || t('settings.user')}
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
                  {user?.user_metadata?.full_name || t('settings.user')}
                </Text>
                <Text className="text-muted-foreground text-sm">{user?.email}</Text>
              </View>
              <TouchableOpacity className="bg-background/80 size-10 items-center justify-center rounded-full border border-white/10">
                <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
              </TouchableOpacity>
            </CardContent>
          </Card>

          {/* General Section */}
          <SettingSection title={t('common.general')}>
            <SettingItem
              icon={Languages}
              title={t('settings.language')}
              description={t('settings.language_desc')}>
              <ToggleGroup
                value={i18n.language}
                onValueChange={handleLanguageChange}
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

            <SettingItem
              icon={Monitor}
              title={t('settings.theme')}
              description={t('settings.theme_desc')}>
              <ToggleGroup
                value={activeTheme}
                onValueChange={(val) => {
                  Uniwind.setTheme(val as any);
                }}
                variant="outline"
                type="single">
                {themes.map((themeItem, index) => (
                  <ToggleGroupItem
                    key={themeItem.name}
                    value={themeItem.name}
                    isFirst={index === 0}
                    isLast={index === themes.length - 1}>
                    <Icon as={themeItem.icon} size={14} />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </SettingItem>
          </SettingSection>

          {/* Preferences Section */}
          <SettingSection title={t('common.preferences')}>
            <SettingActionItem icon={Bell} title={t('settings.notifications')} />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={Volume2} title={t('settings.sounds')} />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={ShieldCheck} title={t('settings.privacy')} />
          </SettingSection>

          {/* Support Section */}
          <SettingSection title={t('common.support')}>
            <SettingActionItem icon={MessageSquare} title={t('settings.help_center')} />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem icon={Heart} title={t('settings.rate_app')} />
            <Separator className="bg-border/50 my-1" />
            <SettingActionItem
              icon={Info}
              title={t('settings.about')}
              description={`${t('common.version')} 1.0.0`}
            />
          </SettingSection>

          {/* Logout Section */}
          <View className="mt-2 mb-10 px-1">
            <Button
              variant="destructive"
              className="h-14 flex-row items-center justify-center gap-2 rounded-2xl shadow-lg shadow-red-500/20"
              onPress={handleLogout}>
              <Icon as={LogOut} size={20} color="white" />
              <Text className="text-lg font-bold text-white">{t('common.logout')}</Text>
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
