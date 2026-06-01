import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { loadStoredTheme, saveStoredTheme } from '../storage/preferencesStorage';
import { themes, type ThemeName, type ThemeTokens } from './palette';

interface ThemeContextValue {
  theme: ThemeTokens;
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  cycleTheme: () => void;
}

const order: ThemeName[] = ['lightDefault', 'darkDefault', 'darkOcean'];
const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [themeName, setThemeNameState] = useState<ThemeName>('lightDefault');

  useEffect(() => {
    void loadStoredTheme().then((stored) => {
      if (stored) {
        setThemeNameState(stored);
      }
    });
  }, []);

  const setThemeName = (nextTheme: ThemeName) => {
    setThemeNameState(nextTheme);
    void saveStoredTheme(nextTheme);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[themeName],
      themeName,
      setThemeName,
      cycleTheme: () => {
        const index = order.indexOf(themeName);
        setThemeName(order[(index + 1) % order.length]);
      },
    }),
    [themeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeProvider no está disponible.');
  }
  return context;
};
