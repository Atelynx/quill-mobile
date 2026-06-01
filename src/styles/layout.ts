import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useTheme } from '../theme/ThemeContext';

export const layoutStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
});

export const useLayoutStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.muted,
      fontSize: 14,
      marginTop: 4,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
    },
  });
};
