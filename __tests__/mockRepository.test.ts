import { MockRepository } from '../src/services/mockRepository';
import { resetMockState } from '../src/services/mockState';

describe('MockRepository', () => {
  beforeEach(() => {
    resetMockState();
  });

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

  it('expone estado de mercado demo', async () => {
    const repository = new MockRepository();

    await expect(repository.getMarketStatus()).resolves.toMatchObject({
      open: true,
      openTime: '09:30',
      closeTime: '16:00',
    });
  });

  it('cancela una orden pendiente demo', async () => {
    const repository = new MockRepository();
    const created = await repository.createOrder({
      symbol: 'COPEC.SN',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 2,
      limitPrice: 7000,
    });

    await expect(repository.cancelOrder(created._id)).resolves.toMatchObject({
      _id: created._id,
      status: 'CANCELLED',
    });
  });

  it('rechaza cancelación demo de orden inexistente', async () => {
    const repository = new MockRepository();

    await expect(repository.cancelOrder('missing-order')).rejects.toThrow('No fue posible cancelar la orden.');
  });

  it('simula registro y expone historial de mercado', async () => {
    const repository = new MockRepository();

    await expect(repository.register({
      fullName: 'Nueva Persona',
      email: 'nueva@quill.local',
      password: 'Demo123456!',
      username: 'nueva_persona',
    })).resolves.toMatchObject({ email: 'nueva@quill.local' });

    await expect(repository.login('nueva@quill.local', 'Demo123456!')).resolves.toMatchObject({
      user: { username: 'nueva_persona' },
    });
    await expect(repository.getMarketHistory('COPEC.SN', 4)).resolves.toHaveLength(4);
  });

  it('actualiza watchlist demo', async () => {
    const repository = new MockRepository();

    await expect(repository.addToWatchlist(['MSFT.US'])).resolves.toMatchObject({
      watchlist: expect.arrayContaining(['MSFT.US']),
    });
    await expect(repository.getWatchlist()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ symbol: 'MSFT.US' })]),
    );
    await expect(repository.removeFromWatchlist('MSFT.US')).resolves.toMatchObject({
      watchlist: expect.not.arrayContaining(['MSFT.US']),
    });
  });

  it('comparte watchlist entre instancias mock', async () => {
    const marketRepository = new MockRepository();
    const userRepository = new MockRepository();

    await marketRepository.addToWatchlist(['MSFT.US']);
    await expect(userRepository.getWatchlist()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ symbol: 'MSFT.US' })]),
    );

    await marketRepository.removeFromWatchlist('MSFT.US');
    await expect(userRepository.getWatchlist()).resolves.not.toEqual(
      expect.arrayContaining([expect.objectContaining({ symbol: 'MSFT.US' })]),
    );
  });


  it('resuelve solicitudes de amistad demo', async () => {
    const repository = new MockRepository();
    const requests = await repository.getFriendRequests();

    await expect(repository.acceptFriendRequest(requests[0].from._id)).resolves.toMatchObject({
      message: 'Solicitud demo aceptada.',
    });
    await expect(repository.getFriends()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: requests[0].from._id })]),
    );
  });
});
