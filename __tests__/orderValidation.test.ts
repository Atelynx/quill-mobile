import { validateOrderInput } from '../src/services/orderValidation';

describe('validateOrderInput', () => {
  it('acepta órdenes MARKET sin precio límite', () => {
    const result = validateOrderInput({
      symbol: 'copec.sn',
      side: 'BUY',
      type: 'MARKET',
      quantity: '3',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.symbol).toBe('COPEC.SN');
      expect(result.data.limitPrice).toBeUndefined();
    }
  });

  it('rechaza órdenes LIMIT sin precio límite', () => {
    const result = validateOrderInput({
      symbol: 'AAPL.US',
      side: 'SELL',
      type: 'LIMIT',
      quantity: 2,
    });

    expect(result.success).toBe(false);
  });

  it('rechaza cantidad decimal o precio límite no positivo', () => {
    const result = validateOrderInput({
      symbol: 'AAPL.US',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 1.5,
      limitPrice: 0,
    });

    expect(result.success).toBe(false);
  });
});
