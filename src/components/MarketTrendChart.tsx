import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';
import type { CurrencyCode, PricePoint } from '../types/domain';
import { historyRange } from '../utils/history';
import { formatMoney, formatSignedPercent } from '../utils/money';

interface MarketTrendChartProps {
  data: PricePoint[];
  currency: CurrencyCode;
}

export const MarketTrendChart = ({ data, currency }: MarketTrendChartProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  if (data.length < 2) {
    return <Text style={styles.empty}>Sin historial suficiente para graficar.</Text>;
  }

  const first = data[0].price;
  const last = data[data.length - 1].price;
  const variation = ((last - first) / first) * 100;
  const range = historyRange(data);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.value}>{formatMoney(last, currency)}</Text>
        <Text style={[styles.variation, variation < 0 && styles.negative]}>
          {formatSignedPercent(variation)}
        </Text>
      </View>
      <View style={styles.chart}>
        {data.map((point) => {
          const height = barHeight(point.price, range.min, range.max);
          return <View key={`${point.createdAt}-${point.price}`} style={[styles.bar, { height }]} />;
        })}
      </View>
      <View style={styles.range}>
        <Text style={styles.rangeText}>Mín. {formatMoney(range.min, currency)}</Text>
        <Text style={styles.rangeText}>Máx. {formatMoney(range.max, currency)}</Text>
      </View>
    </View>
  );
};

const barHeight = (price: number, min: number, max: number) => {
  if (max === min) {
    return 56;
  }
  return 18 + ((price - min) / (max - min)) * 72;
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  value: { color: theme.text, fontSize: 18, fontWeight: '800' },
  variation: { color: theme.success, fontWeight: '800' },
  negative: { color: theme.danger },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 3,
    height: 104,
    marginTop: 14,
  },
  bar: { backgroundColor: theme.chart, borderRadius: 5, flex: 1, minWidth: 3 },
  range: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rangeText: { color: theme.muted, fontSize: 12 },
  empty: { color: theme.muted },
});
