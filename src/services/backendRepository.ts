import { HttpClient } from '../api/httpClient';
import type {
  AuthSession,
  CreateOrderInput,
  CurrencyRate,
  OrderRecord,
  PortfolioSummary,
  StockQuote,
  TradeRecord,
  UserProfile,
} from '../types/domain';
import type { DataRepository } from './contracts';
import { validateOrderInput } from './orderValidation';

export class BackendRepository implements DataRepository {
  constructor(private readonly client: HttpClient) {}

  async login(email: string, password: string): Promise<AuthSession> {
    return this.client.request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(): Promise<UserProfile> {
    return this.client.request<UserProfile>('/users/me');
  }

  async getMarket(): Promise<StockQuote[]> {
    return this.client.request<StockQuote[]>('/market/stocks');
  }

  async getPortfolio(): Promise<PortfolioSummary> {
    return this.client.request<PortfolioSummary>('/portfolio/summary');
  }

  async getOrders(): Promise<OrderRecord[]> {
    return this.client.request<OrderRecord[]>('/orders');
  }

  async createOrder(input: CreateOrderInput): Promise<OrderRecord | void> {
    const result = validateOrderInput(input);
    if (!result.success) {
      throw new Error(result.errors.join(' '));
    }
    return this.client.request<OrderRecord>('/orders', {
      method: 'POST',
      body: JSON.stringify(result.data),
    });
  }

  async getTrades(limit = 20): Promise<TradeRecord[]> {
    return this.client.request<TradeRecord[]>(`/trades?limit=${limit}`);
  }

  async getCurrencyRate(): Promise<CurrencyRate> {
    return this.client.request<CurrencyRate>('/currency/rates/USDCLP');
  }

  async getConnectionStatus() {
    try {
      await this.client.request('/system/health');
      return 'ok' as const;
    } catch {
      return 'unavailable' as const;
    }
  }
}
