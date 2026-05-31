import {
  demoCurrencyRate,
  demoOrders,
  demoPortfolio,
  demoQuotes,
  demoTrades,
  demoUser,
} from '../mocks/demoData';
import type { AuthSession, CreateOrderInput, OrderRecord, TradeRecord } from '../types/domain';
import type { DataRepository } from './contracts';
import { validateOrderInput } from './orderValidation';

export class MockRepository implements DataRepository {
  private orders = [...demoOrders];
  private trades = [...demoTrades];

  async login(email: string): Promise<AuthSession> {
    return {
      accessToken: 'mock-session-token',
      user: { ...demoUser, email: email || demoUser.email },
    };
  }

  async getProfile() {
    return demoUser;
  }

  async getMarket() {
    return demoQuotes;
  }

  async getPortfolio() {
    return demoPortfolio;
  }

  async getOrders() {
    return this.orders;
  }

  async createOrder(input: CreateOrderInput): Promise<OrderRecord> {
    const result = validateOrderInput(input);
    if (!result.success) {
      throw new Error(result.errors.join(' '));
    }
    const order = this.buildOrder(result.data);
    this.orders = [order, ...this.orders];
    if (order.status === 'EXECUTED') {
      this.trades = [this.buildTrade(order), ...this.trades];
    }
    return order;
  }

  async getTrades(limit = 20): Promise<TradeRecord[]> {
    return this.trades.slice(0, limit);
  }

  async getCurrencyRate() {
    return demoCurrencyRate;
  }

  async getConnectionStatus() {
    return 'ok' as const;
  }

  private buildOrder(input: CreateOrderInput): OrderRecord {
    const quote = demoQuotes.find((item) => item.symbol === input.symbol);
    const executed = input.type === 'MARKET';
    return {
      _id: `mock-${Date.now()}`,
      ...input,
      status: executed ? 'EXECUTED' : 'PENDING',
      executionPrice: executed ? quote?.close : undefined,
      createdAt: new Date().toISOString(),
      executedAt: executed ? new Date().toISOString() : undefined,
    };
  }

  private buildTrade(order: OrderRecord): TradeRecord {
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
  }
}
