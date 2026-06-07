import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GoalProvider, useGoals } from '@/context/goals';

function InitialRedirect() {
  const { goals, loading } = useGoals();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const atOnboarding = segments[0] === 'onboarding';
    if (goals.length === 0 && !atOnboarding) {
      router.replace('/onboarding');
    }
  }, [loading, goals.length, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GoalProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitialRedirect />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="session/[goalId]" />
          <Stack.Screen name="complete/[goalId]" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="add-goal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GoalProvider>
  );
}
