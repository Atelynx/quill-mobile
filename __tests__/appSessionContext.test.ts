import { createElement } from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { AuthSession } from '../src/types/domain';
import { AppSessionProvider, useAppSession } from '../src/state/AppSessionContext';

const mockClearStoredSession = jest.fn<Promise<void>, []>();
const mockLoadStoredSession = jest.fn<Promise<AuthSession | undefined>, []>();

jest.mock('../src/storage/sessionStorage', () => ({
  clearStoredSession: () => mockClearStoredSession(),
  loadStoredSession: () => mockLoadStoredSession(),
  saveStoredSession: jest.fn(() => Promise.resolve()),
}));

const session: AuthSession = {
  accessToken: 'session-token',
  user: {
    id: 'user-1',
    fullName: 'Usuario Demo',
    email: 'demo@quill.cl',
    username: 'usuario_demo',
    watchlist: [],
    availableBalance: 100,
    reservedBalance: 0,
  },
};

const SessionProbe = () => {
  const { logout, session: currentSession } = useAppSession();
  return createElement(
    Pressable,
    { onPress: logout, testID: 'logout' },
    createElement(Text, { testID: 'session' }, currentSession?.user.id ?? 'cerrada'),
  );
};

const renderSession = async () => {
  render(createElement(AppSessionProvider, null, createElement(SessionProbe)));
  await waitFor(() => expect(screen.getByTestId('session').props.children).toBe('user-1'));
};

describe('AppSessionProvider logout', () => {
  beforeEach(() => {
    mockClearStoredSession.mockReset().mockResolvedValue();
    mockLoadStoredSession.mockReset().mockResolvedValue(session);
  });

  it('limpia la sesión persistida al cerrar sesión', async () => {
    await renderSession();

    fireEvent.press(screen.getByTestId('logout'));

    await waitFor(() => expect(mockClearStoredSession).toHaveBeenCalledTimes(1));
  });

  it('limpia la sesión en memoria inmediatamente', async () => {
    await renderSession();

    fireEvent.press(screen.getByTestId('logout'));

    expect(screen.getByTestId('session').props.children).toBe('cerrada');
  });

  it('observa y registra fallos de limpieza persistida', async () => {
    const error = new Error('SecureStore no disponible');
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockClearStoredSession.mockRejectedValueOnce(error);
    await renderSession();

    fireEvent.press(screen.getByTestId('logout'));

    await waitFor(() => expect(consoleError).toHaveBeenCalledWith(
      'No fue posible eliminar la sesión persistida.',
      error,
    ));
    expect(screen.getByTestId('session').props.children).toBe('cerrada');
    consoleError.mockRestore();
  });
});
