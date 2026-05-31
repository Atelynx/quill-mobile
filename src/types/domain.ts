export type CurrencyCode = 'CLP' | 'USD';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';
export type OrderStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  availableBalance: number;
  reservedBalance: number;
}

export interface AuthSession {
  accessToken: string;
  user: UserProfile;
}

export interface StockQuote {
  symbol: string;
  name: string;
  currency: CurrencyCode;
  close: number;
  previousClose: number;
  dayChangePercentage: number;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  reservedQuantity: number;
  averageCost: number;
  marketPrice: number;
  marketValue: number;
  unrealizedProfitLoss: number;
}

export interface PortfolioSummary {
  availableBalance: number;
  reservedBalance: number;
  investedValue: number;
  totalEquity: number;
  unrealizedProfitLoss: number;
  positions: PortfolioPosition[];
}

export interface OrderRecord {
  _id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  status: OrderStatus;
  executionPrice?: number;
  commissionAmount?: number;
  createdAt: string;
  executedAt?: string;
}

export interface TradeRecord {
  _id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  executionPrice: number;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  executedAt: string;
}

export interface CurrencyRate {
  symbol: 'USDCLP';
  rate: number;
  basePrice: number;
  dayChangePercentage: number;
}

export interface CreateOrderInput {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
}
