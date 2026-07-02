import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { DataMode } from '../config/env';
import type { DataRepository } from '../services/contracts';
import { createRepositoryBundle } from '../services/repositoryFactory';
import { clearStoredSession, loadLastEmail, loadStoredSession, saveLastEmail } from '../storage/sessionStorage';
import type { AuthSession, CurrencyCode, RegisterInput, RegisterResult, UserProfile } from '../types/domain';

interface AppSessionValue {
  session?: AuthSession;
  mode: DataMode;
  repository: DataRepository;
  accessToken?: string;
  hydrating: boolean;
  lastEmail: string;
  preferredCurrency: CurrencyCode;
  setPreferredCurrency: (currency: CurrencyCode) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<RegisterResult>;
  updateSessionUser: (user: UserProfile) => Promise<void>;
  logout: () => void;
}

const AppSessionContext = createContext<AppSessionValue | null>(null);

export const AppSessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthSession>();
  const [hydrating, setHydrating] = useState(true);
  const [lastEmail, setLastEmail] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('CLP');
  const tokenRef = useRef<string | undefined>(undefined);
  const closeSession = useCallback(() => {
    tokenRef.current = undefined;
    setSession(undefined);
    clearStoredSession().catch((error: unknown) => {
      console.error('No fue posible eliminar la sesión persistida.', error);
    });
  }, []);
  const bundle = useMemo(
    () => createRepositoryBundle(() => tokenRef.current, closeSession),
    [closeSession],
  );

  useEffect(() => {
    const restoreSession = async () => {
      await loadStoredSession();
      setLastEmail(await loadLastEmail());
      setHydrating(false);
    };
    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await bundle.repository.login(email, password);
    const nextSession = { ...response, user: normalizeUser(response.user) };
    tokenRef.current = nextSession.accessToken;
    setSession(nextSession);
    setLastEmail(nextSession.user.email);
    await saveLastEmail(nextSession.user.email);
  };

  const register = (input: RegisterInput) => bundle.repository.register(input);

  const updateSessionUser = async (user: UserProfile) => {
    if (!session) {
      return;
    }
    const nextSession = { ...session, user: normalizeUser(user) };
    setSession(nextSession);
  };

  return (
    <AppSessionContext.Provider
      value={{
        session,
        mode: bundle.mode,
        repository: bundle.repository,
        accessToken: tokenRef.current,
        hydrating,
        lastEmail,
        preferredCurrency,
        setPreferredCurrency,
        login,
        register,
        updateSessionUser,
        logout: closeSession,
      }}
    >
      {children}
    </AppSessionContext.Provider>
  );
};

const normalizeUser = (user: UserProfile): UserProfile => ({
  ...user,
  username: user.username ?? null,
  watchlist: user.watchlist ?? [],
});

export const useAppSession = () => {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error('AppSessionProvider no está disponible.');
  }
  return context;
};
