import type { AuthSession } from '../src/types/domain';
import { clearStoredSession, loadStoredSession, saveStoredSession } from '../src/storage/sessionStorage';

const mockStore = new Map<string, string>();

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn((key: string, value: string) => {
    mockStore.set(key, value);
    return Promise.resolve();
  }),
  getItemAsync: jest.fn((key: string) => Promise.resolve(mockStore.get(key) ?? null)),
  deleteItemAsync: jest.fn((key: string) => {
    mockStore.delete(key);
    return Promise.resolve();
  }),
}));

describe('sessionStorage', () => {
  const session: AuthSession = {
    accessToken: 'token',
    user: {
      id: 'u1',
      fullName: 'Usuario Demo',
      email: 'demo@quill.cl',
      availableBalance: 100,
      reservedBalance: 0,
    },
  };

  it('guarda, carga y limpia una sesión segura', async () => {
    await saveStoredSession(session);
    await expect(loadStoredSession()).resolves.toEqual(session);
    await clearStoredSession();
    await expect(loadStoredSession()).resolves.toBeUndefined();
  });
});
