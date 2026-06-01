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

export interface DataRepository {
  login(email: string, password: string): Promise<AuthSession>;
  register(input: RegisterInput): Promise<RegisterResult>;
  getProfile(): Promise<UserProfile>;
  getMarket(): Promise<StockQuote[]>;
  getMarketHistory(symbol: string, limit?: number): Promise<PricePoint[]>;
  getPortfolio(): Promise<PortfolioSummary>;
  getOrders(): Promise<OrderRecord[]>;
  createOrder(input: CreateOrderInput): Promise<OrderRecord | void>;
  getTrades(limit?: number): Promise<TradeRecord[]>;
  getCurrencyRate(): Promise<CurrencyRate>;
  getConnectionStatus(): Promise<'ok' | 'unavailable'>;
}
