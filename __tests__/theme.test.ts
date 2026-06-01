import { isThemeName, themes } from '../src/theme/palette';

describe('theme palette', () => {
  it('incluye temas principales adaptados a móvil', () => {
    expect(themes.lightDefault.mode).toBe('light');
    expect(themes.darkDefault.mode).toBe('dark');
    expect(themes.darkOcean.label).toBe('Océano');
  });

  it('valida nombres persistidos', () => {
    expect(isThemeName('darkOcean')).toBe(true);
    expect(isThemeName('unknown')).toBe(false);
  });
});
