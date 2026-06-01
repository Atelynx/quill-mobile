import { HttpClient } from '../api/httpClient';
import type {
  AuthSession,
  CreateOrderInput,
  CurrencyRate,
  OrderRecord,
  PricePoint,
  PortfolioSummary,
  RegisterInput,
  RegisterResult,
  StockQuote,
  TradeRecord,
  UserProfile,
} from '../types/domain';
import type { DataRepository } from './contracts';
import { estimatedUsdClpRate } from './currencyFallback';
import { validateOrderInput } from './orderValidation';
import { validateRegisterInput } from './registerValidation';

export class BackendRepository implements DataRepository {
  constructor(private readonly client: HttpClient) {}

  async login(email: string, password: string): Promise<AuthSession> {
    return this.client.request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    const result = validateRegisterInput(input);
    if (!result.success) {
      throw new Error(result.errors.join(' '));
    }
    return this.client.request<RegisterResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(result.data),
    });
  }

  async getProfile(): Promise<UserProfile> {
    return this.client.request<UserProfile>('/users/me');
  }

  async getMarket(): Promise<StockQuote[]> {
    return this.client.request<StockQuote[]>('/market/stocks');
  }

  async getMarketHistory(symbol: string, limit = 24): Promise<PricePoint[]> {
    return this.client.request<PricePoint[]>(
      `/market/stocks/${encodeURIComponent(symbol)}/history?limit=${limit}`,
    );
  }

  async getPortfolio(): Promise<PortfolioSummary> {
    return this.client.request<PortfolioSummary>('/portfolio/summary');
  }

  async getOrders(): Promise<OrderRecord[]> {
    return this.client.request<OrderRecord[]>('/orders?status=PENDING');
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
    try {
      return await this.client.request<CurrencyRate>('/currency/rates/USDCLP');
    } catch {
      return estimatedUsdClpRate();
    }
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
