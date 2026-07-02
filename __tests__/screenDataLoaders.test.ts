import { ApiError } from '../src/api/httpClient';
import { ESTIMATED_USDCLP_RATE } from '../src/services/currencyFallback';
import { MockRepository } from '../src/services/mockRepository';
import {
  loadMarketScreenData,
  loadOrdersMarketData,
  loadPortfolioScreenData,
  loadTradeHistoryData,
} from '../src/screens/screenDataLoaders';

const unavailableUsdClp = () => new ApiError('Rate for USDCLP not available', 404);

describe('screenDataLoaders', () => {
  it('USDCLP 404 no bloquea MarketScreen', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockRejectedValueOnce(unavailableUsdClp());

    const data = await loadMarketScreenData(repository);

    expect(data.market.length).toBeGreaterThan(0);
    expect(data.status).toMatchObject({ open: true });
    expect(data.rate).toMatchObject({
      rate: ESTIMATED_USDCLP_RATE,
      estimated: true,
    });
  });

  it('market status con error no bloquea cotizaciones', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getMarketStatus').mockRejectedValueOnce(new Error('Estado no disponible'));

    const data = await loadMarketScreenData(repository);

    expect(data.market.length).toBeGreaterThan(0);
    expect(data.status).toBeUndefined();
    expect(data.statusError).toBe('Estado no disponible');
  });

  it('USDCLP 404 no bloquea PortfolioScreen', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockRejectedValueOnce(unavailableUsdClp());

    const data = await loadPortfolioScreenData(repository);

    expect(data.portfolio.totalEquity).toBeGreaterThan(0);
    expect(data.rate.estimated).toBe(true);
  });

  it('USDCLP 404 no bloquea OrdersScreen', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockRejectedValueOnce(unavailableUsdClp());

    const data = await loadOrdersMarketData(repository);

    expect(data.quotes.length).toBeGreaterThan(0);
    expect(data.rate.message).toBe('Usando tasa estimada.');
  });

  it('trades entrega empty state funcional cuando no hay ejecuciones', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getTrades').mockResolvedValueOnce([]);

    await expect(loadTradeHistoryData(repository)).resolves.toEqual({ trades: [] });
  });

  it('usa tasa fallback visible cuando backend no entrega USDCLP', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockRejectedValueOnce(unavailableUsdClp());

    const data = await loadMarketScreenData(repository);

    expect(data.rate.rate).toBe(ESTIMATED_USDCLP_RATE);
    expect(data.rate.estimated).toBe(true);
    expect(data.rate.message).toContain('tasa estimada');
  });

  it('usa la tasa real cuando backend entrega USDCLP', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockResolvedValueOnce({
      symbol: 'USDCLP',
      rate: 912,
      basePrice: 912,
      dayChangePercentage: 0.3,
    });

    const data = await loadMarketScreenData(repository);

    expect(data.rate.rate).toBe(912);
    expect(data.rate).not.toHaveProperty('estimated');
  });
});
