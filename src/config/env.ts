export type DataMode = 'mock' | 'backend' | 'backend-fallback';

const readFlag = (value: string | undefined, fallback: boolean) => {
  if (value == null) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
};

export interface AppConfig {
  useMocks: boolean;
  apiBaseUrl: string;
  socketUrl: string;
  fallbackToMocks: boolean;
}

const requiredProductionUrl = (
  value: string | undefined,
  fallback: string,
  name: string,
  required: boolean,
) => {
  if (required && !value) {
    throw new Error(`${name} es obligatoria en producción cuando se usa el backend.`);
  }
  return value ?? fallback;
};

export const resolveAppConfig = (env: Record<string, string | undefined>): AppConfig => {
  const production = env.NODE_ENV === 'production';
  const useMocks = readFlag(env.EXPO_PUBLIC_USE_MOCKS, false);
  const requiresBackendUrls = production && !useMocks;
  return {
    useMocks,
    apiBaseUrl: requiredProductionUrl(
      env.EXPO_PUBLIC_API_BASE_URL,
      'http://localhost:3000/api',
      'EXPO_PUBLIC_API_BASE_URL',
      requiresBackendUrls,
    ),
    socketUrl: requiredProductionUrl(
      env.EXPO_PUBLIC_SOCKET_URL,
      'http://localhost:3000/realtime',
      'EXPO_PUBLIC_SOCKET_URL',
      requiresBackendUrls,
    ),
    fallbackToMocks:
      !production && !useMocks && readFlag(env.EXPO_PUBLIC_FALLBACK_TO_MOCKS, false),
  };
};

const runtimeEnv = {
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_USE_MOCKS: process.env.EXPO_PUBLIC_USE_MOCKS,
  EXPO_PUBLIC_FALLBACK_TO_MOCKS: process.env.EXPO_PUBLIC_FALLBACK_TO_MOCKS,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
};

export const appConfig = resolveAppConfig(runtimeEnv);

export const getDataMode = (config: AppConfig = appConfig): DataMode => {
  if (config.useMocks) {
    return 'mock';
  }
  return config.fallbackToMocks ? 'backend-fallback' : 'backend';
};
