import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { themes, type ThemeName, type ThemeTokens } from '../theme/palette';

const options: ThemeName[] = ['lightDefault', 'darkDefault', 'darkOcean'];

export const ThemeSelector = () => {
  const { theme, themeName, setThemeName } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container} accessibilityLabel="Selector de tema">
      {options.map((name) => (
        <Pressable
          accessibilityRole="button"
          key={name}
          onPress={() => setThemeName(name)}
          style={[styles.option, themeName === name && styles.active]}
        >
          <Text style={[styles.text, themeName === name && styles.activeText]}>
            {themes[name].label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    backgroundColor: theme.surfaceMuted,
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  active: { backgroundColor: theme.primary, borderColor: theme.primary },
  text: { color: theme.muted, fontSize: 12, fontWeight: '700' },
  activeText: { color: theme.surface },
});
