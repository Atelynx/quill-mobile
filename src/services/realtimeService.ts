import { io, type Socket } from 'socket.io-client';
import { appConfig, type AppConfig } from '../config/env';

export const REALTIME_NAMESPACE_PATH = '/realtime';

export type RealtimeStatus = 'connected' | 'disconnected' | 'error';

type SocketFactory = typeof io;

export interface RealtimeClient {
  subscribeStock(symbol: string): void;
  subscribeForex(symbol: string): void;
  disconnect(): void;
}

interface RealtimeHandlers {
  onPrice: (event: { symbol: string; price: number; dayChangePercentage?: number }) => void;
  onStatus?: (status: RealtimeStatus) => void;
}

export const hasRealtimeNamespace = (socketUrl: string) => {
  try {
    return new URL(socketUrl).pathname.replace(/\/$/, '') === REALTIME_NAMESPACE_PATH;
  } catch {
    return false;
  }
};

export const buildRealtimeSocketUrl = (config: Pick<AppConfig, 'socketUrl'>) =>
  config.socketUrl.replace(/\/$/, '');

export const buildRealtimeOptions = (token: string) => ({
  transports: ['websocket'],
  auth: { token },
});

export const createRealtimeClient = (
  token: string,
  handlers: RealtimeHandlers,
  config: Pick<AppConfig, 'socketUrl'> = appConfig,
  socketFactory: SocketFactory = io,
): RealtimeClient => {
  const socketUrl = buildRealtimeSocketUrl(config);
  if (!hasRealtimeNamespace(socketUrl)) {
    handlers.onStatus?.('error');
    return createUnavailableClient();
  }

  const socket: Socket = socketFactory(socketUrl, buildRealtimeOptions(token));

  socket.on('connect', () => handlers.onStatus?.('connected'));
  socket.on('disconnect', () => handlers.onStatus?.('disconnected'));
  socket.on('connect_error', () => handlers.onStatus?.('error'));
  socket.on('price_update', handlers.onPrice);

  return {
    subscribeStock: (symbol) => socket.emit('subscribe', { topic: symbol, type: 'stock' }),
    subscribeForex: (symbol) => socket.emit('subscribe', { topic: symbol, type: 'forex' }),
    disconnect: () => socket.disconnect(),
  };
};

const createUnavailableClient = (): RealtimeClient => ({
  subscribeStock: () => undefined,
  subscribeForex: () => undefined,
  disconnect: () => undefined,
});
