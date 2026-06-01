import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { StatusBanner } from '../components/StatusBanner';
import { ThemeSelector } from '../components/ThemeSelector';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { useLayoutStyles } from '../styles/layout';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';
import { formatMoney } from '../utils/money';

export const UserScreen = () => {
  const session = useAppSession();
  const layoutStyles = useLayoutStyles();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const status = useAsyncResource(
    () => session.repository.getConnectionStatus(),
    [session.repository],
  );

  return (
    <ScrollView style={layoutStyles.screen}>
      <Text style={layoutStyles.title}>Usuario</Text>
      <Text style={layoutStyles.subtitle}>Sesión, perfil y origen de datos</Text>
      <StatusBanner
        mode={session.mode}
        message={status.data === 'ok' ? 'Origen disponible' : 'Origen sin respuesta'}
      />
      <Card>
        <Text style={styles.name}>{session.session?.user.fullName}</Text>
        <Text style={styles.email}>{session.session?.user.email}</Text>
        <View style={styles.divider} />
        <Metric label="Saldo disponible" value={formatMoney(session.session?.user.availableBalance ?? 0, 'CLP')} />
        <Metric label="Saldo reservado" value={formatMoney(session.session?.user.reservedBalance ?? 0, 'CLP')} />
      </Card>
      <Card>
        <Text style={styles.section}>Integración</Text>
        <Text style={styles.copy}>
          El modo backend usa JWT Bearer en memoria y endpoints REST bajo la URL configurada.
        </Text>
      </Card>
      <Card>
        <Text style={styles.section}>Tema</Text>
        <Text style={styles.copy}>El tema seleccionado se conserva en este dispositivo.</Text>
        <ThemeSelector />
      </Card>
      <Pressable accessibilityRole="button" onPress={session.logout} style={styles.button}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <MetricContent label={label} value={value} />
);

const MetricContent = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.metric}>
      <Text style={styles.email}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  name: { color: theme.text, fontSize: 20, fontWeight: '800' },
  email: { color: theme.muted, marginTop: 4 },
  divider: { backgroundColor: theme.border, height: 1, marginVertical: 14 },
  metric: { marginBottom: 10 },
  value: { color: theme.text, fontSize: 16, fontWeight: '700' },
  section: { color: theme.text, fontSize: 16, fontWeight: '800' },
  copy: { color: theme.muted, lineHeight: 20, marginBottom: 10, marginTop: 6 },
  button: { backgroundColor: theme.danger, borderRadius: 8, padding: 14 },
  buttonText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
});
