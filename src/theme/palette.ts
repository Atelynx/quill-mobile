export type ThemeName = 'lightDefault' | 'darkDefault' | 'darkOcean';
export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  name: ThemeName;
  label: string;
  mode: ThemeMode;
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  primarySoft: string;
  success: string;
  danger: string;
  warning: string;
  chart: string;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  lightDefault: {
    name: 'lightDefault',
    label: 'Claro',
    mode: 'light',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF2F7',
    border: '#D8DEE8',
    text: '#172033',
    muted: '#667085',
    primary: '#165BAA',
    primarySoft: '#E8F1FB',
    success: '#15803D',
    danger: '#B42318',
    warning: '#A16207',
    chart: '#1B7F5D',
  },
  darkDefault: {
    name: 'darkDefault',
    label: 'Oscuro',
    mode: 'dark',
    background: '#111827',
    surface: '#1F2937',
    surfaceMuted: '#273449',
    border: '#374151',
    text: '#F9FAFB',
    muted: '#CBD5E1',
    primary: '#60A5FA',
    primarySoft: '#1E3A5F',
    success: '#4ADE80',
    danger: '#F87171',
    warning: '#FBBF24',
    chart: '#34D399',
  },
  darkOcean: {
    name: 'darkOcean',
    label: 'Océano',
    mode: 'dark',
    background: '#041030',
    surface: '#0B1C3D',
    surfaceMuted: '#102B52',
    border: '#174269',
    text: '#F8F6F1',
    muted: '#B9D6E2',
    primary: '#2AA1AD',
    primarySoft: '#103A53',
    success: '#4FD08C',
    danger: '#FF8A7A',
    warning: '#F48E6B',
    chart: '#2AA1AD',
  },
};

export const isThemeName = (value: string | null): value is ThemeName =>
  value === 'lightDefault' || value === 'darkDefault' || value === 'darkOcean';
