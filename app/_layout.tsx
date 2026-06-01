import { Stack } from 'expo-router';
import { AppSessionProvider } from '../src/state/AppSessionContext';
import { ThemeProvider } from '../src/theme/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppSessionProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AppSessionProvider>
    </ThemeProvider>
  );
}
