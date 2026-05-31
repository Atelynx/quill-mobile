import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

interface EmptyStateProps {
  title: string;
  message: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  message: { color: colors.muted, marginTop: 6, textAlign: 'center' },
});
