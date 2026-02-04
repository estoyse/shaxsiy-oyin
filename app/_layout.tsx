import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Uniwind, useUniwind } from 'uniwind';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSegments } from 'expo-router';
import { SocketProvider } from '@/providers/socketProvider';

export { ErrorBoundary } from 'expo-router';

Uniwind.setTheme('system');
const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useUniwind();
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
          <RootLayoutNav />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useUniwind();
  const segments = useSegments();
  const router = useRouter();
  const { session, initialized, setSession, setInitialized } = useAuthStore();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // Not logged in, redirect to login
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      // Logged in, redirect to home
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  if (!initialized) {
    return null; // Or a loading screen
  }

  return (
    <SocketProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: 'Uy', headerShown: false }} />
        <Stack.Screen name="auth" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen
          name="game"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
      <Toaster gap={8} richColors position="top-center" />
    </SocketProvider>
  );
}
