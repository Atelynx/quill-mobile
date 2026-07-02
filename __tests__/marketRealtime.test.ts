import { getRealtimeStatusMessage } from '../src/hooks/useMarketRealtime';

describe('market realtime fallback', () => {
  it('muestra estado conectado cuando Socket.IO está disponible', () => {
    expect(getRealtimeStatusMessage('connected')).toBe('Tiempo real conectado');
  });

  it.each(['disconnected', 'error'] as const)(
    'mantiene REST y recarga manual disponible ante estado %s',
    (status) => {
      expect(getRealtimeStatusMessage(status)).toBe('Actualización manual disponible');
    },
  );
});
