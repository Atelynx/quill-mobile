import { StyleSheet, Text, View } from 'react-native';
import type { DataMode } from '../config/env';
import { colors } from '../constants/colors';

interface StatusBannerProps {
  mode: DataMode;
  message?: string;
}

export const StatusBanner = ({ mode, message }: StatusBannerProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{mode === 'mock' ? 'Datos demo' : 'Backend real'}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  label: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  message: { color: colors.muted, fontSize: 12, marginTop: 3 },
});
