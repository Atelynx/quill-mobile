import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';
import type { UserProfile } from '../../types/domain';
import { formatMoney } from '../../utils/money';

interface ProfileSummaryProps {
  user?: UserProfile;
}

export const ProfileSummary = ({ user }: ProfileSummaryProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Card>
      <Text style={styles.name}>{user?.fullName ?? 'Usuario'}</Text>
      <Text style={styles.email}>{user?.email ?? 'Sin correo disponible'}</Text>
      <Text style={styles.username}>@{user?.username ?? 'sin_username'}</Text>
      <View style={styles.divider} />
      <Metric label="Saldo disponible" value={formatMoney(user?.availableBalance ?? 0, 'CLP')} />
      <Metric label="Saldo reservado" value={formatMoney(user?.reservedBalance ?? 0, 'CLP')} />
    </Card>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => {
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
  username: { color: theme.primary, fontWeight: '700', marginTop: 4 },
  divider: { backgroundColor: theme.border, height: 1, marginVertical: 14 },
  metric: { marginBottom: 10 },
  value: { color: theme.text, fontSize: 16, fontWeight: '700' },
});
