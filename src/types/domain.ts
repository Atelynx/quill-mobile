export type CurrencyCode = 'CLP' | 'USD';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';
export type OrderStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  username?: string | null;
  watchlist: string[];
  availableBalance: number;
  reservedBalance: number;
}

export interface AuthSession {
  accessToken: string;
  user: UserProfile;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  username?: string;
}

export interface RegisterResult {
  message: string;
  email: string;
  username?: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  username?: string;
}

export interface ChangeEmailInput {
  currentPassword: string;
  newEmail: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface WatchlistResponse {
  watchlist: string[];
}

export interface Friend {
  _id: string;
  fullName: string;
  email: string;
  username?: string | null;
}

export interface FriendRequest {
  _id: string;
  from: Friend;
  status: 'pending' | 'accepted';
  createdAt: string;
}

export interface MessageResponse {
  message: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  currency: CurrencyCode;
  close: number;
  previousClose: number;
  dayChangePercentage: number;
}

export interface PricePoint {
  symbol: string;
  price: number;
  createdAt: string;
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
  estimated?: boolean;
  message?: string;
}

export interface CreateOrderInput {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
}
