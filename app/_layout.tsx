import { Stack } from 'expo-router';
import { AppSessionProvider } from '../src/state/AppSessionContext';

export default function RootLayout() {
  return (
    <AppSessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppSessionProvider>
  );
}
