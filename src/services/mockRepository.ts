import { demoCurrencyRate, demoPortfolio, demoQuotes } from '../mocks/demoData';
import type { AuthSession, ChangeEmailInput, ChangePasswordInput, CreateOrderInput, OrderRecord, RegisterInput, TradeRecord, UpdateProfileInput } from '../types/domain';
import { buildDemoHistory } from '../utils/history';
import type { DataRepository } from './contracts';
import { buildMockOrder, buildMockTrade } from './mockOrders';
import { getMockState } from './mockState';
import { validateOrderInput } from './orderValidation';
import { validateRegisterInput } from './registerValidation';

export class MockRepository implements DataRepository {
  private state = getMockState();

  async login(email: string, _password?: string): Promise<AuthSession> {
    return {
      accessToken: 'mock-session-token',
      user: { ...this.state.user, email: email || this.state.user.email },
    };
  }

  async register(input: RegisterInput) {
    const result = validateRegisterInput(input);
    if (!result.success) {
      throw new Error(result.errors.join(' '));
    }
    this.state.user = {
      ...this.state.user,
      fullName: result.data.fullName,
      email: result.data.email,
      username: result.data.username ?? this.state.user.username,
    };
    return {
      message: 'Cuenta demo creada. Inicia sesión para continuar.',
      email: result.data.email,
      username: this.state.user.username ?? undefined,
    };
  }

  async getProfile() {
    return this.state.user;
  }

  async updateProfile(input: UpdateProfileInput) {
    this.state.user = {
      ...this.state.user,
      fullName: input.fullName ?? this.state.user.fullName,
      username: input.username ?? this.state.user.username,
    };
    return this.state.user;
  }

  async changeEmail(input: ChangeEmailInput) {
    this.state.user = { ...this.state.user, email: input.newEmail.toLowerCase() };
    return { message: 'Correo demo actualizado.' };
  }

  async changePassword(_input: ChangePasswordInput) {
    return { message: 'Contraseña demo actualizada.' };
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
    return this.state.orders;
  }

  async createOrder(input: CreateOrderInput): Promise<OrderRecord> {
    const result = validateOrderInput(input);
    if (!result.success) {
      throw new Error(result.errors.join(' '));
    }
    const order = buildMockOrder(result.data, demoQuotes);
    this.state.orders = [order, ...this.state.orders];
    if (order.status === 'EXECUTED') {
      this.state.trades = [buildMockTrade(order), ...this.state.trades];
    }
    return order;
  }

  async getTrades(limit = 20): Promise<TradeRecord[]> {
    return this.state.trades.slice(0, limit);
  }

  async getCurrencyRate() {
    return demoCurrencyRate;
  }

  async getWatchlist() {
    return demoQuotes.filter((quote) => this.state.user.watchlist.includes(quote.symbol));
  }

  async addToWatchlist(symbols: string[]) {
    this.state.user.watchlist = [...new Set([...this.state.user.watchlist, ...symbols.map((item) => item.toUpperCase())])];
    return { watchlist: this.state.user.watchlist };
  }

  async removeFromWatchlist(symbol: string) {
    this.state.user.watchlist = this.state.user.watchlist.filter((item) => item !== symbol.toUpperCase());
    return { watchlist: this.state.user.watchlist };
  }

  async getFriends() {
    return this.state.friends;
  }

  async getFriendRequests() {
    return this.state.requests;
  }

  async sendFriendRequest(userId: string) {
    return { message: `Solicitud demo enviada a ${userId}.` };
  }

  async acceptFriendRequest(userId: string) {
    const request = this.state.requests.find((item) => item.from._id === userId);
    if (request) {
      this.state.friends = [...this.state.friends, request.from];
      this.state.requests = this.state.requests.filter((item) => item.from._id !== userId);
    }
    return { message: 'Solicitud demo aceptada.' };
  }

  async rejectFriendRequest(userId: string) {
    this.state.requests = this.state.requests.filter((item) => item.from._id !== userId);
    return { message: 'Solicitud demo rechazada.' };
  }

  async removeFriend(userId: string) {
    this.state.friends = this.state.friends.filter((friend) => friend._id !== userId);
    return { message: 'Amigo demo eliminado.' };
  }

  async getConnectionStatus() {
    return 'ok' as const;
  }
}
