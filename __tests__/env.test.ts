import { getDataMode, resolveAppConfig } from '../src/config/env';

describe('env config', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

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

  it('lee configuración runtime con variables públicas directas', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      EXPO_PUBLIC_USE_MOCKS: 'false',
      EXPO_PUBLIC_API_BASE_URL: 'https://api.quill.example/api',
      EXPO_PUBLIC_SOCKET_URL: 'https://api.quill.example/realtime',
    };

    jest.isolateModules(() => {
      const { appConfig } = require('../src/config/env');

      expect(appConfig.apiBaseUrl).toBe('https://api.quill.example/api');
      expect(appConfig.socketUrl).toBe('https://api.quill.example/realtime');
      expect(appConfig.useMocks).toBe(false);
    });
  });

  it('configuración runtime falla en producción si falta URL backend', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      EXPO_PUBLIC_USE_MOCKS: 'false',
      EXPO_PUBLIC_API_BASE_URL: undefined,
      EXPO_PUBLIC_SOCKET_URL: 'https://api.quill.example/realtime',
    };

    expect(() => {
      jest.isolateModules(() => require('../src/config/env'));
    }).toThrow('EXPO_PUBLIC_API_BASE_URL es obligatoria');
  });

  it('configuración runtime permite mocks en producción sin URL backend', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      EXPO_PUBLIC_USE_MOCKS: 'true',
      EXPO_PUBLIC_API_BASE_URL: undefined,
      EXPO_PUBLIC_SOCKET_URL: undefined,
    };

    jest.isolateModules(() => {
      const { appConfig, getDataMode } = require('../src/config/env');

      expect(getDataMode(appConfig)).toBe('mock');
      expect(appConfig.apiBaseUrl).toBe('http://localhost:3000/api');
      expect(appConfig.socketUrl).toBe('http://localhost:3000/realtime');
    });
  });
});
