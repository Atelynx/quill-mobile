import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

interface EmptyStateProps {
  title: string;
  message: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  title: { color: theme.text, fontSize: 16, fontWeight: '700' },
  message: { color: theme.muted, marginTop: 6, textAlign: 'center' },
});
