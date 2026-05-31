import { MockRepository } from '../src/services/mockRepository';

describe('MockRepository', () => {
  it('crea una orden demo y la deja al inicio del listado', async () => {
    const repository = new MockRepository();
    const created = await repository.createOrder({
      symbol: 'COPEC.SN',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 2,
      limitPrice: 7000,
    });
    const orders = await repository.getOrders();

    expect(orders[0]._id).toBe(created._id);
    expect(orders[0].status).toBe('PENDING');
  });
});
