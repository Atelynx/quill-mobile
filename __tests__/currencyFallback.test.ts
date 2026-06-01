import { estimatedUsdClpRate, ESTIMATED_USDCLP_RATE } from '../src/services/currencyFallback';
import { BackendRepository } from '../src/services/backendRepository';

describe('currencyFallback', () => {
  it('marca USDCLP como estimado', () => {
    expect(estimatedUsdClpRate()).toMatchObject({
      symbol: 'USDCLP',
      rate: ESTIMATED_USDCLP_RATE,
      estimated: true,
    });
  });

  it('mantiene backend real y usa fallback solo si currency falla', async () => {
    const client = { request: jest.fn().mockRejectedValue(new Error('Rate not available')) };
    const repository = new BackendRepository(client as never);

    await expect(repository.getCurrencyRate()).resolves.toMatchObject({ estimated: true });
    expect(client.request).toHaveBeenCalledWith('/currency/rates/USDCLP');
  });
});
