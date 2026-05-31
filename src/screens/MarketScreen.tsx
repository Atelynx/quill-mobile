import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { CurrencySwitch } from '../components/CurrencySwitch';
import { StatusBanner } from '../components/StatusBanner';
import { colors } from '../constants/colors';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { createRealtimeClient } from '../services/realtimeService';
import { useAppSession } from '../state/AppSessionContext';
import { layoutStyles } from '../styles/layout';
import type { CurrencyRate, StockQuote } from '../types/domain';
import { convertMoney, formatMoney, formatSignedPercent } from '../utils/money';
import { applyCurrencyUpdate, applyMarketUpdate } from '../utils/realtimeUpdates';

export const MarketScreen = () => {
  const session = useAppSession();
  const [liveQuotes, setLiveQuotes] = useState<StockQuote[]>([]);
  const [liveRate, setLiveRate] = useState<CurrencyRate>();
  const [socketStatus, setSocketStatus] = useState('Actualización manual disponible');
  const subscriptionSymbols = useMemo(
    () => resourceDataSymbols(liveQuotes),
    [liveQuotes],
  );
  const resource = useAsyncResource(async () => {
    const [market, rate] = await Promise.all([
      session.repository.getMarket(),
      session.repository.getCurrencyRate(),
    ]);
    return { market, rate };
  }, [session.repository]);

  useEffect(() => {
    if (resource.data) {
      setLiveQuotes(resource.data.market);
      setLiveRate(resource.data.rate);
    }
  }, [resource.data]);

  useEffect(() => {
    if (session.mode !== 'backend' || !session.accessToken || !subscriptionSymbols) {
      return undefined;
    }

    const client = createRealtimeClient(session.accessToken, {
      onStatus: (status) =>
        setSocketStatus(status === 'connected' ? 'Tiempo real conectado' : 'Actualización manual disponible'),
      onPrice: (event) => {
        if (event.symbol === 'USDCLP') {
          setLiveRate((current) => (current ? applyCurrencyUpdate(current, event) : current));
          return;
        }
        setLiveQuotes((current) => applyMarketUpdate(current, event));
      },
    });

    subscriptionSymbols.split('|').forEach((symbol) => client.subscribeStock(symbol));
    client.subscribeForex('USDCLP');
    return () => client.disconnect();
  }, [session.accessToken, session.mode, subscriptionSymbols]);

  const rate = liveRate?.rate ?? 1;
  return (
    <ScrollView
      style={layoutStyles.screen}
      refreshControl={<RefreshControl refreshing={resource.loading} onRefresh={resource.refresh} />}
    >
      <View style={layoutStyles.row}>
        <View>
          <Text style={layoutStyles.title}>Mercado</Text>
          <Text style={layoutStyles.subtitle}>Cotizaciones principales</Text>
        </View>
        <CurrencySwitch value={session.preferredCurrency} onChange={session.setPreferredCurrency} />
      </View>
      <StatusBanner mode={session.mode} message={`USDCLP ${formatMoney(rate, 'CLP')} · ${socketStatus}`} />
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {liveQuotes.map((quote) => {
        const value = convertMoney(quote.close, quote.currency, session.preferredCurrency, rate);
        const tone = quote.dayChangePercentage >= 0 ? 'success' : 'danger';
        return (
          <Card key={quote.symbol}>
            <View style={layoutStyles.row}>
              <View style={styles.info}>
                <Text style={styles.symbol}>{quote.symbol}</Text>
                <Text style={styles.name}>{quote.name}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.price}>{formatMoney(value, session.preferredCurrency)}</Text>
                <Badge label={formatSignedPercent(quote.dayChangePercentage)} tone={tone} />
              </View>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const resourceDataSymbols = (quotes: StockQuote[]) =>
  quotes.map((quote) => quote.symbol).join('|');

const styles = StyleSheet.create({
  info: { flex: 1 },
  symbol: { color: colors.text, fontSize: 17, fontWeight: '800' },
  name: { color: colors.muted, marginTop: 3 },
  priceBox: { alignItems: 'flex-end', gap: 6 },
  price: { color: colors.text, fontSize: 16, fontWeight: '700' },
  error: { color: colors.danger, marginVertical: 10 },
});
