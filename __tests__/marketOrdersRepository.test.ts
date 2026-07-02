import { BackendRepository } from '../src/services/backendRepository';

describe('BackendRepository market and orders parity', () => {
  it('consume GET /market/status', async () => {
    const client = {
      request: jest.fn().mockResolvedValue({
        open: true,
        openTime: '09:30',
        closeTime: '16:00',
        currentTime: '2026-07-02T12:00:00.000Z',
      }),
    };
    const repository = new BackendRepository(client as never);

    await expect(repository.getMarketStatus()).resolves.toMatchObject({ open: true });
    expect(client.request).toHaveBeenCalledWith('/market/status');
  });

  it('cancela orden pendiente con PATCH /orders/:id/cancel', async () => {
    const client = {
      request: jest.fn().mockResolvedValue({
        _id: 'order-1',
        symbol: 'AAPL.US',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 1,
        status: 'CANCELLED',
        createdAt: '2026-07-02T12:00:00.000Z',
      }),
    };
    const repository = new BackendRepository(client as never);

    await expect(repository.cancelOrder('order-1')).resolves.toMatchObject({ status: 'CANCELLED' });
    expect(client.request).toHaveBeenCalledWith('/orders/order-1/cancel', { method: 'PATCH' });
  });

  it('propaga error de cancelación de orden', async () => {
    const client = { request: jest.fn().mockRejectedValue(new Error('Orden no cancelable')) };
    const repository = new BackendRepository(client as never);

    await expect(repository.cancelOrder('order-1')).rejects.toThrow('Orden no cancelable');
  });
});
