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
    return this.safe((repo) => repo.getProfile());
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
    return this.safe((repo) => repo.getPortfolio());
  }

  getOrders() {
    return this.safe((repo) => repo.getOrders());
  }

  createOrder(input: CreateOrderInput) {
    return this.primary.createOrder(input);
  }

  getTrades(limit?: number) {
    return this.safe((repo) => repo.getTrades(limit));
  }

  getCurrencyRate() {
    return this.safe((repo) => repo.getCurrencyRate());
  }

  getWatchlist() {
    return this.safe((repo) => repo.getWatchlist());
  }

  addToWatchlist(symbols: string[]) {
    return this.safe((repo) => repo.addToWatchlist(symbols));
  }

  removeFromWatchlist(symbol: string) {
    return this.safe((repo) => repo.removeFromWatchlist(symbol));
  }

  getFriends() {
    return this.safe((repo) => repo.getFriends());
  }

  getFriendRequests() {
    return this.safe((repo) => repo.getFriendRequests());
  }

  sendFriendRequest(userId: string) {
    return this.safe((repo) => repo.sendFriendRequest(userId));
  }

  acceptFriendRequest(userId: string) {
    return this.safe((repo) => repo.acceptFriendRequest(userId));
  }

  rejectFriendRequest(userId: string) {
    return this.safe((repo) => repo.rejectFriendRequest(userId));
  }

  removeFriend(userId: string) {
    return this.safe((repo) => repo.removeFriend(userId));
  }

  getConnectionStatus() {
    return this.primary.getConnectionStatus();
  }

  private async safe<T>(action: (repo: DataRepository) => Promise<T>): Promise<T> {
    try {
      return await action(this.primary);
    } catch {
      return action(this.fallback);
    }
  }
}
