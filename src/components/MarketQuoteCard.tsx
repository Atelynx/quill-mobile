import { StyleSheet, Text, View } from 'react-native';
import { Badge } from './Badge';
import { Card } from './Card';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';
import type { CurrencyCode, StockQuote } from '../types/domain';
import { convertMoney, formatMoney, formatSignedPercent } from '../utils/money';

interface MarketQuoteCardProps {
  quote: StockQuote;
  targetCurrency: CurrencyCode;
  usdclpRate: number;
}

export const MarketQuoteCard = ({ quote, targetCurrency, usdclpRate }: MarketQuoteCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const value = convertMoney(quote.close, quote.currency, targetCurrency, usdclpRate);
  const tone = quote.dayChangePercentage >= 0 ? 'success' : 'danger';

  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.symbol}>{quote.symbol}</Text>
          <Text style={styles.name}>{quote.name}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>{formatMoney(value, targetCurrency)}</Text>
          <Badge label={formatSignedPercent(quote.dayChangePercentage)} tone={tone} />
        </View>
      </View>
    </Card>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  info: { flex: 1 },
  symbol: { color: theme.text, fontSize: 17, fontWeight: '800' },
  name: { color: theme.muted, marginTop: 3 },
  priceBox: { alignItems: 'flex-end', gap: 6 },
  price: { color: theme.text, fontSize: 16, fontWeight: '700' },
});
