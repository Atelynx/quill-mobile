import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { CurrencySwitch } from '../components/CurrencySwitch';
import { MarketQuoteCard } from '../components/MarketQuoteCard';
import { MarketTrendChart } from '../components/MarketTrendChart';
import { StatusBanner } from '../components/StatusBanner';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useMarketRealtime } from '../hooks/useMarketRealtime';
import { useAppSession } from '../state/AppSessionContext';
import { useLayoutStyles } from '../styles/layout';
import { useTheme } from '../theme/ThemeContext';
import { convertHistoryCurrency } from '../utils/history';
import { formatMoney } from '../utils/money';
import { loadMarketScreenData } from './screenDataLoaders';

export const MarketScreen = () => {
  const session = useAppSession();
  const layoutStyles = useLayoutStyles();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedSymbol, setSelectedSymbol] = useState<string>();
  const [watchlist, setWatchlist] = useState(session.session?.user.watchlist ?? []);
  const [watchFeedback, setWatchFeedback] = useState<string>();
  const { liveQuotes, liveRate, setLiveQuotes, setLiveRate, socketStatus } = useMarketRealtime(session);
  const resource = useAsyncResource(
    () => loadMarketScreenData(session.repository),
    [session.repository],
  );
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
  }, [resource.data, setLiveQuotes, setLiveRate]);

  useEffect(() => setWatchlist(session.session?.user.watchlist ?? []), [session.session?.user.watchlist]);

  const toggleWatchlist = async (symbol: string) => {
    setWatchFeedback(undefined);
    try {
      const result = watchlist.includes(symbol)
        ? await session.repository.removeFromWatchlist(symbol)
        : await session.repository.addToWatchlist([symbol]);
      setWatchlist(result.watchlist);
      if (session.session?.user) {
        await session.updateSessionUser({ ...session.session.user, watchlist: result.watchlist });
      }
    } catch (error) {
      setWatchFeedback(error instanceof Error ? error.message : 'No fue posible actualizar seguimiento.');
    }
  };

  const rate = liveRate?.rate ?? 1;
  const selectedQuote = liveQuotes.find((quote) => quote.symbol === selectedSymbol);
  const marketStatus = resource.data?.status;
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
      {marketStatus ? (
        <Text style={marketStatus.open ? styles.success : styles.warning}>
          Mercado {marketStatus.open ? 'abierto' : 'cerrado'} · {marketStatus.openTime}-{marketStatus.closeTime}
        </Text>
      ) : null}
      {resource.data?.statusError ? <Text style={styles.warning}>{resource.data.statusError}</Text> : null}
      {rateMessage ? <Text style={styles.warning}>{rateMessage}</Text> : null}
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {watchFeedback ? <Text style={styles.warning}>{watchFeedback}</Text> : null}
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
          watched={watchlist.includes(quote.symbol)}
          onToggleWatch={() => void toggleWatchlist(quote.symbol)}
        />
      ))}
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) => StyleSheet.create({
  name: { color: theme.muted, marginTop: 3 },
  error: { color: theme.danger, marginVertical: 10 },
  success: { color: theme.success, marginBottom: 10 },
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
