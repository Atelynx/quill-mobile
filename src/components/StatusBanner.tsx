import { StyleSheet, Text, View } from 'react-native';
import type { DataMode } from '../config/env';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

interface StatusBannerProps {
  mode: DataMode;
  message?: string;
}

export const StatusBanner = ({ mode, message }: StatusBannerProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const label = mode === 'mock'
    ? 'Datos demo'
    : mode === 'backend-fallback'
      ? 'Backend con respaldo demo'
      : 'Backend real';
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {mode === 'backend-fallback' ? (
        <Text style={styles.warning}>Mercado público puede contener datos demo o degradados.</Text>
      ) : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: {
    backgroundColor: theme.primarySoft,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  label: { color: theme.primary, fontSize: 13, fontWeight: '700' },
  warning: { color: theme.warning, fontSize: 12, marginTop: 3 },
  message: { color: theme.muted, fontSize: 12, marginTop: 3 },
});
