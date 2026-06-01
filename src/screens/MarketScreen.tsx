import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { CurrencySwitch } from '../components/CurrencySwitch';
import { MarketQuoteCard } from '../components/MarketQuoteCard';
import { MarketTrendChart } from '../components/MarketTrendChart';
import { StatusBanner } from '../components/StatusBanner';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { createRealtimeClient } from '../services/realtimeService';
import { useAppSession } from '../state/AppSessionContext';
import { useLayoutStyles } from '../styles/layout';
import { useTheme } from '../theme/ThemeContext';
import type { CurrencyRate, StockQuote } from '../types/domain';
import { convertHistoryCurrency } from '../utils/history';
import { formatMoney } from '../utils/money';
import { applyCurrencyUpdate, applyMarketUpdate } from '../utils/realtimeUpdates';

export const MarketScreen = () => {
  const session = useAppSession();
  const layoutStyles = useLayoutStyles();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [liveQuotes, setLiveQuotes] = useState<StockQuote[]>([]);
  const [liveRate, setLiveRate] = useState<CurrencyRate>();
  const [selectedSymbol, setSelectedSymbol] = useState<string>();
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
  const history = useAsyncResource(
    () => selectedSymbol ? session.repository.getMarketHistory(selectedSymbol, 24) : Promise.resolve([]),
    [session.repository, selectedSymbol],
  );

  useEffect(() => {
    if (resource.data) {
      const nextData = resource.data;
      setLiveQuotes(nextData.market);
      setLiveRate(nextData.rate);
      setSelectedSymbol((current) => current ?? nextData.market[0]?.symbol);
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
  const selectedQuote = liveQuotes.find((quote) => quote.symbol === selectedSymbol);
  const chartData = useMemo(
    () => convertHistoryCurrency(history.data ?? [], selectedQuote?.currency ?? 'CLP', session.preferredCurrency, rate),
    [history.data, rate, selectedQuote?.currency, session.preferredCurrency],
  );
  const rateMessage = liveRate?.estimated ? liveRate.message : undefined;
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
      <StatusBanner
        mode={session.mode}
        message={`USDCLP ${formatMoney(rate, 'CLP')}${rateMessage ? ' · Usando tasa estimada' : ''} · ${socketStatus}`}
      />
      {rateMessage ? <Text style={styles.warning}>{rateMessage}</Text> : null}
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.symbolList}>
        {liveQuotes.map((quote) => (
          <Pressable
            key={quote.symbol}
            onPress={() => setSelectedSymbol(quote.symbol)}
            style={[styles.symbolChip, selectedSymbol === quote.symbol && styles.activeChip]}
          >
            <Text style={[styles.chipText, selectedSymbol === quote.symbol && styles.activeChipText]}>
              {quote.symbol}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Card>
        <Text style={styles.chartTitle}>{selectedSymbol ?? 'Historial'}</Text>
        {history.error ? <Text style={styles.error}>{history.error}</Text> : null}
        {history.loading ? <Text style={styles.name}>Cargando historial...</Text> : (
          <MarketTrendChart data={chartData} currency={session.preferredCurrency} />
        )}
      </Card>
      {liveQuotes.map((quote) => (
        <MarketQuoteCard
          key={quote.symbol}
          quote={quote}
          targetCurrency={session.preferredCurrency}
          usdclpRate={rate}
        />
      ))}
    </ScrollView>
  );
};

const resourceDataSymbols = (quotes: StockQuote[]) =>
  quotes.map((quote) => quote.symbol).join('|');

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) => StyleSheet.create({
  name: { color: theme.muted, marginTop: 3 },
  error: { color: theme.danger, marginVertical: 10 },
  warning: { color: theme.warning, marginBottom: 10 },
  symbolList: { marginBottom: 12, marginTop: 12 },
  symbolChip: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  activeChip: { backgroundColor: theme.primary },
  chipText: { color: theme.muted, fontWeight: '700' },
  activeChipText: { color: theme.surface },
  chartTitle: { color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 8 },
});
