import * as SecureStore from 'expo-secure-store';
import type { AuthSession } from '../types/domain';

const SESSION_KEY = 'quill_mobile_session';
const LAST_EMAIL_KEY = 'quill_mobile_last_email';

export const saveStoredSession = async (session: AuthSession) => {
  await saveLastEmail(session.user.email);
};

export const loadStoredSession = async (): Promise<AuthSession | undefined> => {
  await clearStoredSession();
  return undefined;
};

export const clearStoredSession = async () => {
  await SecureStore.deleteItemAsync(SESSION_KEY);
};

export const saveLastEmail = async (email: string) => {
  await SecureStore.setItemAsync(LAST_EMAIL_KEY, email.trim().toLowerCase());
};

export const loadLastEmail = async () => {
  return (await SecureStore.getItemAsync(LAST_EMAIL_KEY)) ?? '';
};
