import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';
import type { CurrencyCode } from '../types/domain';

interface CurrencySwitchProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}

export const CurrencySwitch = ({ value, onChange }: CurrencySwitchProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container} accessibilityLabel="Selector de moneda">
      {(['CLP', 'USD'] as const).map((currency) => (
        <Pressable
          accessibilityRole="button"
          key={currency}
          onPress={() => onChange(currency)}
          style={[styles.option, value === currency && styles.active]}
        >
          <Text style={[styles.text, value === currency && styles.activeText]}>{currency}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: theme.surfaceMuted,
    borderRadius: 8,
    flexDirection: 'row',
    padding: 3,
  },
  option: { borderRadius: 6, minWidth: 52, paddingHorizontal: 10, paddingVertical: 7 },
  active: { backgroundColor: theme.primary },
  text: { color: theme.muted, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  activeText: { color: theme.surface },
});
