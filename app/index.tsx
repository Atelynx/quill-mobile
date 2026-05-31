import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { useAppSession } from '../src/state/AppSessionContext';

export default function IndexRoute() {
  const { hydrating, session } = useAppSession();
  if (hydrating) {
    return (
      <View>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }
  if (session) {
    return <Redirect href="/(tabs)/market" />;
  }
  return <LoginScreen />;
}
