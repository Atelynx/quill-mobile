import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../constants/colors';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { layoutStyles } from '../styles/layout';
import type { CurrencyCode } from '../types/domain';
import { convertMoney, formatMoney } from '../utils/money';

export const PortfolioScreen = () => {
  const session = useAppSession();
  const resource = useAsyncResource(async () => {
    const [portfolio, rate] = await Promise.all([
      session.repository.getPortfolio(),
      session.repository.getCurrencyRate(),
    ]);
    return { portfolio, rate };
  }, [session.repository]);

  const rate = resource.data?.rate.rate ?? 1;
  const portfolio = resource.data?.portfolio;
  const money = (value: number, currency: CurrencyCode = 'CLP') =>
    formatMoney(convertMoney(value, currency, session.preferredCurrency, rate), session.preferredCurrency);

  return (
    <ScrollView
      style={layoutStyles.screen}
      refreshControl={<RefreshControl refreshing={resource.loading} onRefresh={resource.refresh} />}
    >
      <Text style={layoutStyles.title}>Portafolio</Text>
      <Text style={layoutStyles.subtitle}>Balance, posiciones y resultado no realizado</Text>
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {portfolio ? (
        <>
          <Card>
            <Text style={styles.label}>Equity total</Text>
            <Text style={styles.big}>{money(portfolio.totalEquity)}</Text>
            <View style={layoutStyles.row}>
              <Metric label="Disponible" value={money(portfolio.availableBalance)} />
              <Metric label="Reservado" value={money(portfolio.reservedBalance)} />
            </View>
          </Card>
          <Text style={layoutStyles.sectionTitle}>Posiciones</Text>
          {portfolio.positions.length === 0 ? (
            <EmptyState title="Sin posiciones" message="Aún no hay activos en el portafolio." />
          ) : (
            portfolio.positions.map((position) => {
              const currency: CurrencyCode = position.symbol.endsWith('.US') ? 'USD' : 'CLP';
              return (
                <Card key={position.symbol}>
                  <View style={layoutStyles.row}>
                    <View>
                      <Text style={styles.symbol}>{position.symbol}</Text>
                      <Text style={styles.label}>{position.quantity} unidades</Text>
                    </View>
                    <View style={styles.right}>
                      <Text style={styles.value}>{money(position.marketValue, currency)}</Text>
                      <Text style={styles.pnl}>{money(position.unrealizedProfitLoss, currency)}</Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </>
      ) : null}
    </ScrollView>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  big: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 14 },
  symbol: { color: colors.text, fontSize: 16, fontWeight: '800' },
  value: { color: colors.text, fontWeight: '700' },
  pnl: { color: colors.success, marginTop: 3 },
  right: { alignItems: 'flex-end' },
  error: { color: colors.danger, marginVertical: 10 },
});
