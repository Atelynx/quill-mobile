import {
  demoCurrencyRate,
  demoOrders,
  demoPortfolio,
  demoQuotes,
  demoTrades,
  demoUser,
} from '../mocks/demoData';
import type { AuthSession, CreateOrderInput, OrderRecord, RegisterInput, TradeRecord } from '../types/domain';
import { buildDemoHistory } from '../utils/history';
import type { DataRepository } from './contracts';
import { validateOrderInput } from './orderValidation';
import { validateRegisterInput } from './registerValidation';

export class MockRepository implements DataRepository {
  private orders = [...demoOrders];
  private trades = [...demoTrades];
  private user = { ...demoUser };

  async login(email: string): Promise<AuthSession> {
    return {
      accessToken: 'mock-session-token',
      user: { ...this.user, email: email || this.user.email },
    };
  }

  async register(input: RegisterInput) {
    const result = validateRegisterInput(input);
    if (!result.success) {
      throw new Error(result.errors.join(' '));
    }
    this.user = { ...this.user, fullName: result.data.fullName, email: result.data.email };
    return { message: 'Cuenta demo creada. Inicia sesión para continuar.', email: result.data.email };
  }

  async getProfile() {
    return this.user;
  }

  async getMarket() {
    return demoQuotes;
  }

  async getMarketHistory(symbol: string, limit = 24) {
    const quote = demoQuotes.find((item) => item.symbol === symbol) ?? demoQuotes[0];
    return buildDemoHistory(quote, limit);
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
