import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';

interface UserSectionHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const UserSectionHeader = ({ title, subtitle, onBack }: UserSectionHeaderProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: { marginBottom: 12 },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.surfaceMuted,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  backText: { color: theme.primary, fontWeight: '800' },
  title: { color: theme.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: theme.muted, fontSize: 14, marginTop: 4 },
});
