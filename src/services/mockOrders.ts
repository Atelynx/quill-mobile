import type { CreateOrderInput, OrderRecord, StockQuote, TradeRecord } from '../types/domain';

export const buildMockOrder = (input: CreateOrderInput, quotes: StockQuote[]): OrderRecord => {
  const quote = quotes.find((item) => item.symbol === input.symbol);
  const executed = input.type === 'MARKET';
  return {
    _id: `mock-${Date.now()}`,
    ...input,
    status: executed ? 'EXECUTED' : 'PENDING',
    executionPrice: executed ? quote?.close : undefined,
    createdAt: new Date().toISOString(),
    executedAt: executed ? new Date().toISOString() : undefined,
  };
};

export const buildMockTrade = (order: OrderRecord): TradeRecord => {
  const price = order.executionPrice ?? order.limitPrice ?? 0;
  const grossAmount = price * order.quantity;
  const commissionAmount = Math.round(grossAmount * 0.005);
  return {
    _id: `trade-${order._id}`,
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity,
    executionPrice: price,
    grossAmount,
    commissionAmount,
    netAmount: grossAmount - commissionAmount,
    executedAt: order.executedAt ?? order.createdAt,
  };
};
