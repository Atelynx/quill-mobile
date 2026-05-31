import { convertMoney, formatMoney, formatSignedPercent } from '../src/utils/money';

describe('money utilities', () => {
  it('convierte USD a CLP usando la tasa entregada', () => {
    expect(convertMoney(10, 'USD', 'CLP', 900)).toBe(9000);
  });

  it('convierte CLP a USD usando la tasa entregada', () => {
    expect(convertMoney(1800, 'CLP', 'USD', 900)).toBe(2);
  });

  it('formatea montos y porcentajes para la interfaz', () => {
    expect(formatMoney(1000, 'CLP')).toContain('$');
    expect(formatSignedPercent(1.234)).toBe('+1.23%');
  });
});
