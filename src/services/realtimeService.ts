import { io, type Socket } from 'socket.io-client';
import { appConfig } from '../config/env';

export interface RealtimeClient {
  subscribeStock(symbol: string): void;
  subscribeForex(symbol: string): void;
  disconnect(): void;
}

interface RealtimeHandlers {
  onPrice: (event: { symbol: string; price: number; dayChangePercentage?: number }) => void;
  onStatus?: (status: 'connected' | 'disconnected' | 'error') => void;
}

export const createRealtimeClient = (
  token: string,
  handlers: RealtimeHandlers,
): RealtimeClient => {
  const socket: Socket = io(appConfig.socketUrl, {
    transports: ['websocket'],
    auth: { token },
  });

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
