import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../constants/colors';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { layoutStyles } from '../styles/layout';
import { formatDateTime } from '../utils/dates';
import { formatMoney } from '../utils/money';

export const HistoryScreen = () => {
  const session = useAppSession();
  const resource = useAsyncResource(() => session.repository.getTrades(20), [session.repository]);

  return (
    <ScrollView
      style={layoutStyles.screen}
      refreshControl={<RefreshControl refreshing={resource.loading} onRefresh={resource.refresh} />}
    >
      <Text style={layoutStyles.title}>Historial</Text>
      <Text style={layoutStyles.subtitle}>Operaciones ejecutadas</Text>
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {resource.data?.length === 0 ? (
        <EmptyState title="Sin operaciones" message="Las ejecuciones confirmadas aparecerán aquí." />
      ) : (
        resource.data?.map((trade) => (
          <Card key={trade._id}>
            <View style={layoutStyles.row}>
              <View>
                <Text style={styles.symbol}>{trade.symbol}</Text>
                <Text style={styles.meta}>{formatDateTime(trade.executedAt)}</Text>
                <Text style={styles.meta}>{trade.quantity} unidades</Text>
              </View>
              <View style={styles.right}>
                <Badge label={trade.side} tone={trade.side === 'BUY' ? 'success' : 'danger'} />
                <Text style={styles.value}>{formatMoney(trade.executionPrice, 'CLP')}</Text>
                <Text style={styles.meta}>Neto {formatMoney(trade.netAmount, 'CLP')}</Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  symbol: { color: colors.text, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 5 },
  value: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, marginVertical: 10 },
});
