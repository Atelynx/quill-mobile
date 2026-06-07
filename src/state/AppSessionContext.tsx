import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { DataMode } from '../config/env';
import type { DataRepository } from '../services/contracts';
import { createRepositoryBundle } from '../services/repositoryFactory';
import { clearStoredSession, loadStoredSession, saveStoredSession } from '../storage/sessionStorage';
import type { AuthSession, CurrencyCode, RegisterInput, RegisterResult, UserProfile } from '../types/domain';

interface AppSessionValue {
  session?: AuthSession;
  mode: DataMode;
  repository: DataRepository;
  accessToken?: string;
  hydrating: boolean;
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
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('CLP');
  const tokenRef = useRef<string | undefined>(undefined);
  const bundle = useMemo(
    () =>
      createRepositoryBundle(() => tokenRef.current, () => {
        tokenRef.current = undefined;
        setSession(undefined);
        void clearStoredSession();
      }),
    [],
  );

  useEffect(() => {
    const restoreSession = async () => {
      const storedSession = await loadStoredSession();
      if (storedSession) {
        tokenRef.current = storedSession.accessToken;
        setSession(storedSession);
      }
      setHydrating(false);
    };
    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await bundle.repository.login(email, password);
    const nextSession = { ...response, user: normalizeUser(response.user) };
    tokenRef.current = nextSession.accessToken;
    setSession(nextSession);
    await saveStoredSession(nextSession);
  };

  const register = (input: RegisterInput) => bundle.repository.register(input);

  const updateSessionUser = async (user: UserProfile) => {
    if (!session) {
      return;
    }
    const nextSession = { ...session, user: normalizeUser(user) };
    setSession(nextSession);
    await saveStoredSession(nextSession);
  };

  const logout = async () => {
    tokenRef.current = undefined;
    setSession(undefined);
    await clearStoredSession();
  };

  return (
    <AppSessionContext.Provider
      value={{
        session,
        mode: bundle.mode,
        repository: bundle.repository,
        accessToken: tokenRef.current,
        hydrating,
        preferredCurrency,
        setPreferredCurrency,
        login,
        register,
        updateSessionUser,
        logout: () => void logout(),
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
