import { FallbackRepository } from '../src/services/fallbackRepository';
import { MockRepository } from '../src/services/mockRepository';

describe('FallbackRepository', () => {
  it('usa mocks cuando una lectura social del backend no está disponible', async () => {
    const primary = new MockRepository();
    jest.spyOn(primary, 'getFriends').mockRejectedValueOnce(new Error('No disponible'));
    const repository = new FallbackRepository(primary, new MockRepository());

    await expect(repository.getFriends()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ email: 'camila@quill.local' })]),
    );
  });

  it('no simula creación de órdenes cuando falla el backend real', async () => {
    const primary = new MockRepository();
    jest.spyOn(primary, 'createOrder').mockRejectedValueOnce(new Error('Orden rechazada'));
    const repository = new FallbackRepository(primary, new MockRepository());

    await expect(repository.createOrder({
      symbol: 'COPEC.SN',
      side: 'BUY',
      type: 'MARKET',
      quantity: 1,
    })).rejects.toThrow('Orden rechazada');
  });
});
