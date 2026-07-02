import {
  buildRealtimeOptions,
  buildRealtimeSocketUrl,
  createRealtimeClient,
  hasRealtimeNamespace,
} from '../src/services/realtimeService';

type EventHandler = (payload?: unknown) => void;

const createSocketHarness = () => {
  const handlers = new Map<string, EventHandler>();
  const socket: {
    on: jest.Mock;
    emit: jest.Mock;
    disconnect: jest.Mock;
  } = {
    on: jest.fn((event: string, handler: EventHandler) => {
      handlers.set(event, handler);
      return socket;
    }),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
  const factory = jest.fn(() => socket);
  return { factory, handlers, socket };
};

describe('realtimeService', () => {
  it('construye la URL de socket sin alterar el namespace /realtime', () => {
    expect(buildRealtimeSocketUrl({
      socketUrl: 'https://quill-backend-production-70a1.up.railway.app/realtime/',
    })).toBe('https://quill-backend-production-70a1.up.railway.app/realtime');
  });

  it('valida que EXPO_PUBLIC_SOCKET_URL incluya el namespace correcto', () => {
    expect(hasRealtimeNamespace('https://quill-backend-production-70a1.up.railway.app/realtime')).toBe(true);
    expect(hasRealtimeNamespace('https://quill-backend-production-70a1.up.railway.app')).toBe(false);
  });

  it('conecta Socket.IO al namespace configurado con token JWT', () => {
    const { factory } = createSocketHarness();

    createRealtimeClient(
      'jwt-token',
      { onPrice: jest.fn() },
      { socketUrl: 'https://api.quill.example/realtime' },
      factory as never,
    );

    expect(factory).toHaveBeenCalledWith(
      'https://api.quill.example/realtime',
      buildRealtimeOptions('jwt-token'),
    );
  });

  it('maneja conexión, desconexión y error sin lanzar excepciones', () => {
    const { factory, handlers } = createSocketHarness();
    const onStatus = jest.fn();

    createRealtimeClient(
      'jwt-token',
      { onPrice: jest.fn(), onStatus },
      { socketUrl: 'https://api.quill.example/realtime' },
      factory as never,
    );

    handlers.get('connect')?.();
    handlers.get('disconnect')?.();
    handlers.get('connect_error')?.();

    expect(onStatus).toHaveBeenNthCalledWith(1, 'connected');
    expect(onStatus).toHaveBeenNthCalledWith(2, 'disconnected');
    expect(onStatus).toHaveBeenNthCalledWith(3, 'error');
  });

  it('mantiene fallback funcional cuando la URL no apunta a /realtime', () => {
    const { factory, socket } = createSocketHarness();
    const onStatus = jest.fn();

    const client = createRealtimeClient(
      'jwt-token',
      { onPrice: jest.fn(), onStatus },
      { socketUrl: 'https://api.quill.example' },
      factory as never,
    );

    client.subscribeStock('AAPL.US');
    client.subscribeForex('USDCLP');
    client.disconnect();

    expect(onStatus).toHaveBeenCalledWith('error');
    expect(factory).not.toHaveBeenCalled();
    expect(socket.emit).not.toHaveBeenCalled();
  });
});
