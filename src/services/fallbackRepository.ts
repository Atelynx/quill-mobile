import type { DataRepository } from './contracts';
import type {
  ChangeEmailInput,
  ChangePasswordInput,
  CreateOrderInput,
  RegisterInput,
  UpdateProfileInput,
} from '../types/domain';

export class FallbackRepository implements DataRepository {
  constructor(
    private readonly primary: DataRepository,
    private readonly fallback: DataRepository,
  ) {}

  login(email: string, password: string) {
    return this.primary.login(email, password);
  }

  register(input: RegisterInput) {
    return this.primary.register(input);
  }

  getProfile() {
    return this.primary.getProfile();
  }

  updateProfile(input: UpdateProfileInput) {
    return this.primary.updateProfile(input);
  }

  changeEmail(input: ChangeEmailInput) {
    return this.primary.changeEmail(input);
  }

  changePassword(input: ChangePasswordInput) {
    return this.primary.changePassword(input);
  }

  getMarket() {
    return this.safe((repo) => repo.getMarket());
  }

  getMarketHistory(symbol: string, limit?: number) {
    return this.safe((repo) => repo.getMarketHistory(symbol, limit));
  }

  getPortfolio() {
    return this.primary.getPortfolio();
  }

  getOrders() {
    return this.primary.getOrders();
  }

  createOrder(input: CreateOrderInput) {
    return this.primary.createOrder(input);
  }

  getTrades(limit?: number) {
    return this.primary.getTrades(limit);
  }

  getCurrencyRate() {
    return this.safe((repo) => repo.getCurrencyRate());
  }

  getWatchlist() {
    return this.primary.getWatchlist();
  }

  addToWatchlist(symbols: string[]) {
    return this.primary.addToWatchlist(symbols);
  }

  removeFromWatchlist(symbol: string) {
    return this.primary.removeFromWatchlist(symbol);
  }

  getFriends() {
    return this.primary.getFriends();
  }

  getFriendRequests() {
    return this.primary.getFriendRequests();
  }

  sendFriendRequest(userId: string) {
    return this.primary.sendFriendRequest(userId);
  }

  acceptFriendRequest(userId: string) {
    return this.primary.acceptFriendRequest(userId);
  }

  rejectFriendRequest(userId: string) {
    return this.primary.rejectFriendRequest(userId);
  }

  removeFriend(userId: string) {
    return this.primary.removeFriend(userId);
  }

  getConnectionStatus() {
    return this.primary.getConnectionStatus();
  }

  private async safe<T>(action: (repo: DataRepository) => Promise<T>): Promise<T> {
    try {
      return await action(this.primary);
    } catch (error) {
      if (!(error instanceof TypeError)) {
        throw error;
      }
      return action(this.fallback);
    }
  }
}
