import * as SecureStore from 'expo-secure-store';
import type { ThemeName } from '../theme/palette';
import { isThemeName } from '../theme/palette';

const THEME_KEY = 'quill_mobile_theme';

export const saveStoredTheme = async (theme: ThemeName) => {
  await SecureStore.setItemAsync(THEME_KEY, theme);
};

export const loadStoredTheme = async (): Promise<ThemeName | undefined> => {
  const raw = await SecureStore.getItemAsync(THEME_KEY);
  return isThemeName(raw) ? raw : undefined;
};
