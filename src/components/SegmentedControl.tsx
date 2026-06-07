import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

interface SegmentedControlProps<T extends string> {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}

export const SegmentedControl = <T extends string>({
  values,
  value,
  onChange,
  labels,
}: SegmentedControlProps<T>) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.segment}>
      {values.map((item) => (
        <Pressable key={item} onPress={() => onChange(item)} style={[styles.item, value === item && styles.active]}>
          <Text style={[styles.text, value === item && styles.activeText]}>{labels?.[item] ?? item}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  segment: { flexDirection: 'row', gap: 8, marginVertical: 4 },
  item: { backgroundColor: theme.surfaceMuted, borderRadius: 8, flex: 1, minHeight: 42, padding: 10 },
  active: { backgroundColor: theme.primary },
  text: { color: theme.muted, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  activeText: { color: theme.surface },
});
