import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppSessionProvider } from '../src/state/AppSessionContext';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { useTheme } from '../src/theme/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RootSafeArea>
          <AppSessionProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </AppSessionProvider>
        </RootSafeArea>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const RootSafeArea = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});
