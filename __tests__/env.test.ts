import { getDataMode, resolveAppConfig } from '../src/config/env';

describe('env config', () => {
  it('deshabilita mocks y fallback por defecto', () => {
    const config = resolveAppConfig({});

    expect(config.useMocks).toBe(false);
    expect(config.fallbackToMocks).toBe(false);
    expect(getDataMode(config)).toBe('backend');
  });

  it('permite modo demo explícito', () => {
    const config = resolveAppConfig({ EXPO_PUBLIC_USE_MOCKS: 'true' });

    expect(getDataMode(config)).toBe('mock');
  });

  it('permite fallback visible solo en desarrollo explícito', () => {
    const config = resolveAppConfig({
      NODE_ENV: 'development',
      EXPO_PUBLIC_FALLBACK_TO_MOCKS: 'true',
    });

    expect(config.fallbackToMocks).toBe(true);
    expect(getDataMode(config)).toBe('backend-fallback');
  });

  it('producción deshabilita fallback aunque se solicite', () => {
    const config = resolveAppConfig({
      NODE_ENV: 'production',
      EXPO_PUBLIC_API_BASE_URL: 'https://api.quill.example/api',
      EXPO_PUBLIC_SOCKET_URL: 'https://api.quill.example/realtime',
      EXPO_PUBLIC_FALLBACK_TO_MOCKS: 'true',
    });

    expect(config.fallbackToMocks).toBe(false);
    expect(getDataMode(config)).toBe('backend');
  });

  it('producción falla claramente si falta configuración backend crítica', () => {
    expect(() => resolveAppConfig({ NODE_ENV: 'production' }))
      .toThrow('EXPO_PUBLIC_API_BASE_URL es obligatoria');
  });
});
