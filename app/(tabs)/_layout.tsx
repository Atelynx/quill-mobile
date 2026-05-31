import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Text, View } from 'react-native';
import { colors } from '../../src/constants/colors';
import { useAppSession } from '../../src/state/AppSessionContext';

const icon = (name: keyof typeof MaterialCommunityIcons.glyphMap) =>
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <MaterialCommunityIcons name={name} color={String(color)} size={size} />;
  };

export default function TabsLayout() {
  const { hydrating, session } = useAppSession();
  if (hydrating) {
    return (
      <View>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }
  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen name="market" options={{ title: 'Mercado', tabBarIcon: icon('chart-line') }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portafolio', tabBarIcon: icon('briefcase') }} />
      <Tabs.Screen name="orders" options={{ title: 'Órdenes', tabBarIcon: icon('swap-horizontal') }} />
      <Tabs.Screen name="history" options={{ title: 'Historial', tabBarIcon: icon('history') }} />
      <Tabs.Screen name="user" options={{ title: 'Usuario', tabBarIcon: icon('account-circle') }} />
    </Tabs>
  );
}
