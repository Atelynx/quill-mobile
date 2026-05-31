import * as SecureStore from 'expo-secure-store';
import type { AuthSession } from '../types/domain';

const SESSION_KEY = 'quill_mobile_session';

export const saveStoredSession = async (session: AuthSession) => {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
};

export const loadStoredSession = async (): Promise<AuthSession | undefined> => {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    await clearStoredSession();
    return undefined;
  }
};

export const clearStoredSession = async () => {
  await SecureStore.deleteItemAsync(SESSION_KEY);
};
