import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { DataMode } from '../config/env';
import type { DataRepository } from '../services/contracts';
import { createRepositoryBundle } from '../services/repositoryFactory';
import { clearStoredSession, loadStoredSession, saveStoredSession } from '../storage/sessionStorage';
import type { AuthSession, CurrencyCode, RegisterInput, RegisterResult } from '../types/domain';

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
    const nextSession = await bundle.repository.login(email, password);
    tokenRef.current = nextSession.accessToken;
    setSession(nextSession);
    await saveStoredSession(nextSession);
  };

  const register = (input: RegisterInput) => bundle.repository.register(input);

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
        logout: () => void logout(),
      }}
    >
      {children}
    </AppSessionContext.Provider>
  );
};

export const useAppSession = () => {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error('AppSessionProvider no está disponible.');
  }
  return context;
};
