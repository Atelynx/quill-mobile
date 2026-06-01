import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

interface BadgeProps {
  label: string;
  tone?: 'neutral' | 'success' | 'danger' | 'warning';
}

export const Badge = ({ label, tone = 'neutral' }: BadgeProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return <Text style={[styles.badge, styles[tone]]}>{label}</Text>;
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  neutral: { backgroundColor: theme.surfaceMuted, color: theme.text },
  success: { backgroundColor: theme.primarySoft, color: theme.success },
  danger: { backgroundColor: theme.primarySoft, color: theme.danger },
  warning: { backgroundColor: theme.primarySoft, color: theme.warning },
});
