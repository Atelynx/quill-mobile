import { createElement } from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { AuthSession } from '../src/types/domain';
import { AppSessionProvider, useAppSession } from '../src/state/AppSessionContext';

const mockClearStoredSession = jest.fn<Promise<void>, []>();
const mockLoadStoredSession = jest.fn<Promise<AuthSession | undefined>, []>();
const mockLoadLastEmail = jest.fn<Promise<string>, []>();
const mockSaveLastEmail = jest.fn<Promise<void>, [string]>();
const mockLogin = jest.fn<Promise<AuthSession>, [string, string]>();

jest.mock('../src/storage/sessionStorage', () => ({
  clearStoredSession: () => mockClearStoredSession(),
  loadLastEmail: () => mockLoadLastEmail(),
  loadStoredSession: () => mockLoadStoredSession(),
  saveLastEmail: (email: string) => mockSaveLastEmail(email),
}));

jest.mock('../src/services/repositoryFactory', () => ({
  createRepositoryBundle: () => ({
    mode: 'backend',
    repository: {
      login: (email: string, password: string) => mockLogin(email, password),
      register: jest.fn(),
    },
  }),
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
  const context = useAppSession();
  return createElement(
    Pressable,
    { onPress: context.logout, testID: 'logout' },
    createElement(Text, { testID: 'session' }, context.session?.user.id ?? 'cerrada'),
    createElement(Text, { testID: 'email' }, context.lastEmail),
    createElement(
      Pressable,
      { onPress: () => void context.login('demo@quill.cl', 'Manual123!'), testID: 'login' },
      createElement(Text, null, 'login'),
    ),
  );
};

describe('AppSessionProvider', () => {
  beforeEach(() => {
    mockClearStoredSession.mockReset().mockResolvedValue();
    mockLoadStoredSession.mockReset().mockResolvedValue(session);
    mockLoadLastEmail.mockReset().mockResolvedValue('demo@quill.cl');
    mockSaveLastEmail.mockReset().mockResolvedValue();
    mockLogin.mockReset().mockResolvedValue(session);
  });

  it('no hace auto-login con una sesión persistida', async () => {
    render(createElement(AppSessionProvider, null, createElement(SessionProbe)));

    await waitFor(() => expect(screen.getByTestId('email').props.children).toBe('demo@quill.cl'));

    expect(screen.getByTestId('session').props.children).toBe('cerrada');
    expect(mockLoadStoredSession).toHaveBeenCalledTimes(1);
  });

  it('activa sesión solo después de login manual exitoso', async () => {
    render(createElement(AppSessionProvider, null, createElement(SessionProbe)));
    await waitFor(() => expect(screen.getByTestId('session').props.children).toBe('cerrada'));

    fireEvent.press(screen.getByTestId('login'));

    await waitFor(() => expect(screen.getByTestId('session').props.children).toBe('user-1'));
    expect(mockSaveLastEmail).toHaveBeenCalledWith('demo@quill.cl');
  });

  it('logout vuelve a sesión cerrada y limpia sesión antigua', async () => {
    render(createElement(AppSessionProvider, null, createElement(SessionProbe)));
    await waitFor(() => expect(screen.getByTestId('session').props.children).toBe('cerrada'));
    fireEvent.press(screen.getByTestId('login'));
    await waitFor(() => expect(screen.getByTestId('session').props.children).toBe('user-1'));

    fireEvent.press(screen.getByTestId('logout'));

    expect(screen.getByTestId('session').props.children).toBe('cerrada');
    await waitFor(() => expect(mockClearStoredSession).toHaveBeenCalled());
  });
});
