import type { AuthSession } from '../src/types/domain';
import {
  clearStoredSession,
  loadLastEmail,
  loadStoredSession,
  saveLastEmail,
  saveStoredSession,
} from '../src/storage/sessionStorage';

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
  beforeEach(() => {
    mockStore.clear();
  });

  const session: AuthSession = {
    accessToken: 'token',
    user: {
      id: 'u1',
      fullName: 'Usuario Demo',
      email: 'demo@quill.cl',
      username: 'usuario_demo',
      watchlist: ['AAPL.US'],
      availableBalance: 100,
      reservedBalance: 0,
    },
  };

  it('no restaura sesiones persistidas ni tokens antiguos', async () => {
    mockStore.set('quill_mobile_session', JSON.stringify(session));

    await expect(loadStoredSession()).resolves.toBeUndefined();
    expect(mockStore.has('quill_mobile_session')).toBe(false);
  });

  it('guarda solo el último correo usado', async () => {
    await saveStoredSession(session);

    await expect(loadLastEmail()).resolves.toBe('demo@quill.cl');
    await expect(loadStoredSession()).resolves.toBeUndefined();
  });

  it('normaliza el último correo y no guarda contraseña', async () => {
    await saveLastEmail('  Usuario@Quill.CL  ');

    await expect(loadLastEmail()).resolves.toBe('usuario@quill.cl');
    expect([...mockStore.values()].join(' ')).not.toContain('password');
  });

  it('limpia solo la sesión antigua sin borrar el último correo', async () => {
    mockStore.set('quill_mobile_session', JSON.stringify(session));
    await saveLastEmail('demo@quill.cl');

    await clearStoredSession();

    await expect(loadLastEmail()).resolves.toBe('demo@quill.cl');
    expect(mockStore.has('quill_mobile_session')).toBe(false);
  });
});
