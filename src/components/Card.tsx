import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

export const Card = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return <View style={styles.card}>{children}</View>;
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
});
