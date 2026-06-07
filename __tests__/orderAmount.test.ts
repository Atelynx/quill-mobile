import { estimateQuantityFromAmount } from '../src/services/orderAmount';

describe('estimateQuantityFromAmount', () => {
  it('redondea la cantidad estimada hacia abajo', () => {
    expect(estimateQuantityFromAmount(15000, 7000)).toEqual({
      quantity: 2,
      estimatedCost: 14000,
      enoughForOne: true,
    });
  });

  it('bloquea montos menores al precio de una acción', () => {
    expect(estimateQuantityFromAmount(6000, 7000)).toMatchObject({
      quantity: 0,
      enoughForOne: false,
    });
  });
});
