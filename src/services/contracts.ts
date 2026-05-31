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

export interface DataRepository {
  login(email: string, password: string): Promise<AuthSession>;
  getProfile(): Promise<UserProfile>;
  getMarket(): Promise<StockQuote[]>;
  getPortfolio(): Promise<PortfolioSummary>;
  getOrders(): Promise<OrderRecord[]>;
  createOrder(input: CreateOrderInput): Promise<OrderRecord | void>;
  getTrades(limit?: number): Promise<TradeRecord[]>;
  getCurrencyRate(): Promise<CurrencyRate>;
  getConnectionStatus(): Promise<'ok' | 'unavailable'>;
}
