import { Icon } from '@/components/ui/icon';
import { useTheme } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { HistoryIcon, HomeIcon, RadioIcon, SettingsIcon } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={HomeIcon} color={color} />,
          tabBarLabel: 'Asosiy',
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={RadioIcon} color={color} />,
          tabBarLabel: "Aktiv O'yinlar",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Sozlamalar',
          tabBarIcon: ({ color }) => <Icon as={SettingsIcon} color={color} />,
        }}
      />
    </Tabs>
  );
}
