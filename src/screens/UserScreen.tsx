import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { StatusBanner } from '../components/StatusBanner';
import { colors } from '../constants/colors';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { layoutStyles } from '../styles/layout';
import { formatMoney } from '../utils/money';

export const UserScreen = () => {
  const session = useAppSession();
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
      <Pressable accessibilityRole="button" onPress={session.logout} style={styles.button}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metric}>
    <Text style={styles.email}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  email: { color: colors.muted, marginTop: 4 },
  divider: { backgroundColor: colors.border, height: 1, marginVertical: 14 },
  metric: { marginBottom: 10 },
  value: { color: colors.text, fontSize: 16, fontWeight: '700' },
  section: { color: colors.text, fontSize: 16, fontWeight: '800' },
  copy: { color: colors.muted, lineHeight: 20, marginTop: 6 },
  button: { backgroundColor: colors.danger, borderRadius: 8, padding: 14 },
  buttonText: { color: colors.surface, fontWeight: '700', textAlign: 'center' },
});
