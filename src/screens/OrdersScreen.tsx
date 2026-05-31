import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { OrderForm } from '../components/OrderForm';
import { colors } from '../constants/colors';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { layoutStyles } from '../styles/layout';
import type { CreateOrderInput } from '../types/domain';
import { formatDateTime } from '../utils/dates';
import { formatMoney } from '../utils/money';

export const OrdersScreen = () => {
  const session = useAppSession();
  const resource = useAsyncResource(() => session.repository.getOrders(), [session.repository]);

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
        <OrderForm onSubmit={createOrder} />
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

const styles = StyleSheet.create({
  symbol: { color: colors.text, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 5 },
  price: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, marginVertical: 10 },
});
