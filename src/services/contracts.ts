import type {
  AuthSession,
  ChangeEmailInput,
  ChangePasswordInput,
  CreateOrderInput,
  CurrencyRate,
  Friend,
  FriendRequest,
  MarketStatus,
  MessageResponse,
  OrderRecord,
  PricePoint,
  PortfolioSummary,
  RegisterInput,
  RegisterResult,
  StockQuote,
  TradeRecord,
  UpdateProfileInput,
  UserProfile,
  WatchlistResponse,
} from '../types/domain';

export interface DataRepository {
  login(email: string, password: string): Promise<AuthSession>;
  register(input: RegisterInput): Promise<RegisterResult>;
  getProfile(): Promise<UserProfile>;
  updateProfile(input: UpdateProfileInput): Promise<UserProfile>;
  changeEmail(input: ChangeEmailInput): Promise<MessageResponse | void>;
  changePassword(input: ChangePasswordInput): Promise<MessageResponse | void>;
  getMarket(): Promise<StockQuote[]>;
  getMarketStatus(): Promise<MarketStatus>;
  getMarketHistory(symbol: string, limit?: number): Promise<PricePoint[]>;
  getPortfolio(): Promise<PortfolioSummary>;
  getOrders(): Promise<OrderRecord[]>;
  createOrder(input: CreateOrderInput): Promise<OrderRecord | void>;
  cancelOrder(id: string): Promise<OrderRecord>;
  getTrades(limit?: number): Promise<TradeRecord[]>;
  getCurrencyRate(): Promise<CurrencyRate>;
  getWatchlist(): Promise<StockQuote[]>;
  addToWatchlist(symbols: string[]): Promise<WatchlistResponse>;
  removeFromWatchlist(symbol: string): Promise<WatchlistResponse>;
  getFriends(): Promise<Friend[]>;
  getFriendRequests(): Promise<FriendRequest[]>;
  sendFriendRequest(userId: string): Promise<MessageResponse>;
  acceptFriendRequest(userId: string): Promise<MessageResponse>;
  rejectFriendRequest(userId: string): Promise<MessageResponse>;
  removeFriend(userId: string): Promise<MessageResponse>;
  getConnectionStatus(): Promise<'ok' | 'unavailable'>;
}
