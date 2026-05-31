import { StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

interface BadgeProps {
  label: string;
  tone?: 'neutral' | 'success' | 'danger' | 'warning';
}

export const Badge = ({ label, tone = 'neutral' }: BadgeProps) => (
  <Text style={[styles.badge, styles[tone]]}>{label}</Text>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  neutral: { backgroundColor: colors.surfaceMuted, color: colors.text },
  success: { backgroundColor: '#EAF7EE', color: colors.success },
  danger: { backgroundColor: '#FDECEC', color: colors.danger },
  warning: { backgroundColor: '#FEF7E6', color: colors.warning },
});
