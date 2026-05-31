export type DataMode = 'mock' | 'backend';

const readFlag = (value: string | undefined, fallback: boolean) => {
  if (value == null) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
};

export const appConfig = {
  useMocks: readFlag(process.env.EXPO_PUBLIC_USE_MOCKS, true),
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api',
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000/realtime',
  fallbackToMocks: readFlag(process.env.EXPO_PUBLIC_FALLBACK_TO_MOCKS, true),
};

export const getDataMode = (): DataMode =>
  readFlag(process.env.EXPO_PUBLIC_USE_MOCKS, true) ? 'mock' : 'backend';
