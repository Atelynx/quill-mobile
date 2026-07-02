import { ApiError } from '../src/api/httpClient';
import { FallbackRepository } from '../src/services/fallbackRepository';
import { MockRepository } from '../src/services/mockRepository';

describe('FallbackRepository', () => {
  it('usa mocks ante fallos de transporte en lecturas públicas permitidas', async () => {
    const primary = new MockRepository();
    jest.spyOn(primary, 'getMarket').mockRejectedValueOnce(new TypeError('Network request failed'));
    const repository = new FallbackRepository(primary, new MockRepository());

    await expect(repository.getMarket()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ symbol: 'COPEC.SN' })]),
    );
  });

  it.each([400, 401, 403, 500])('no convierte HTTP %s en datos mock', async (status) => {
    const primary = new MockRepository();
    jest.spyOn(primary, 'getMarket').mockRejectedValueOnce(new ApiError('Solicitud rechazada', status));
    const repository = new FallbackRepository(primary, new MockRepository());

    await expect(repository.getMarket()).rejects.toMatchObject({ status });
  });

  it('no simula mutaciones reales fallidas', async () => {
    const primary = new MockRepository();
    const error = new Error('Mutación rechazada');
    jest.spyOn(primary, 'addToWatchlist').mockRejectedValueOnce(error);
    jest.spyOn(primary, 'sendFriendRequest').mockRejectedValueOnce(error);
    jest.spyOn(primary, 'updateProfile').mockRejectedValueOnce(error);
    jest.spyOn(primary, 'createOrder').mockRejectedValueOnce(error);
    const repository = new FallbackRepository(primary, new MockRepository());

    await expect(repository.addToWatchlist(['COPEC.SN'])).rejects.toThrow('Mutación rechazada');
    await expect(repository.sendFriendRequest('user-1')).rejects.toThrow('Mutación rechazada');
    await expect(repository.updateProfile({ fullName: 'Nombre real' })).rejects.toThrow('Mutación rechazada');
    await expect(repository.createOrder({
      symbol: 'COPEC.SN',
      side: 'BUY',
      type: 'MARKET',
      quantity: 1,
    })).rejects.toThrow('Mutación rechazada');
  });
});
