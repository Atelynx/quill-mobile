import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { OrderForm } from '../components/OrderForm';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { useLayoutStyles } from '../styles/layout';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';
import type { CreateOrderInput } from '../types/domain';
import { formatDateTime } from '../utils/dates';
import { formatMoney } from '../utils/money';

export const OrdersScreen = () => {
  const session = useAppSession();
  const layoutStyles = useLayoutStyles();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const resource = useAsyncResource(() => session.repository.getOrders(), [session.repository]);
  const market = useAsyncResource(async () => {
    const [quotes, rate] = await Promise.all([
      session.repository.getMarket(),
      session.repository.getCurrencyRate(),
    ]);
    return { quotes, rate };
  }, [session.repository]);

  const createOrder = async (input: CreateOrderInput) => {
    await session.repository.createOrder(input);
    await resource.refresh();
  };

  return (
    <ScrollView
      style={layoutStyles.screen}
      refreshControl={<RefreshControl refreshing={resource.loading} onRefresh={resource.refresh} />}
    >
      <Text style={layoutStyles.title}>Órdenes</Text>
      <Text style={layoutStyles.subtitle}>Crea órdenes LIMIT o MARKET</Text>
      <Card>
        <OrderForm
          onSubmit={createOrder}
          quotes={market.data?.quotes ?? []}
          rate={market.data?.rate.rate ?? 950}
        />
      </Card>
      <Text style={layoutStyles.sectionTitle}>Órdenes recientes</Text>
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {resource.data?.length === 0 ? (
        <EmptyState title="Sin órdenes" message="Las órdenes creadas aparecerán aquí." />
      ) : (
        resource.data?.map((order) => (
          <Card key={order._id}>
            <View style={layoutStyles.row}>
              <View>
                <Text style={styles.symbol}>{order.symbol}</Text>
                <Text style={styles.meta}>{order.type} · {order.quantity} unidades</Text>
                <Text style={styles.meta}>{formatDateTime(order.createdAt)}</Text>
              </View>
              <View style={styles.right}>
                <Badge label={order.side} tone={order.side === 'BUY' ? 'success' : 'danger'} />
                <Badge label={order.status} tone={order.status === 'PENDING' ? 'warning' : 'neutral'} />
                {order.limitPrice ? <Text style={styles.price}>{formatMoney(order.limitPrice, 'CLP')}</Text> : null}
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  symbol: { color: theme.text, fontSize: 16, fontWeight: '800' },
  meta: { color: theme.muted, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 5 },
  price: { color: theme.text, fontWeight: '700' },
  error: { color: theme.danger, marginVertical: 10 },
});
