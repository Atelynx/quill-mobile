import { ApiError } from '../src/api/httpClient';
import { ESTIMATED_USDCLP_RATE } from '../src/services/currencyFallback';
import { MockRepository } from '../src/services/mockRepository';
import {
  loadOrdersMarketData,
  loadPortfolioScreenData,
  loadTradeHistoryData,
} from '../src/screens/screenDataLoaders';

const unavailableUsdClp = () => new ApiError('Rate for USDCLP not available', 404);

describe('portfolio and orders loaders', () => {
  it('portfolio carga aunque currency rate use fallback', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockRejectedValueOnce(unavailableUsdClp());

    const data = await loadPortfolioScreenData(repository);

    expect(data.portfolio.totalEquity).toBeGreaterThan(0);
    expect(data.rate.rate).toBe(ESTIMATED_USDCLP_RATE);
    expect(data.rate.estimated).toBe(true);
  });

  it('orders carga aunque currency rate use fallback', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getCurrencyRate').mockRejectedValueOnce(unavailableUsdClp());

    const data = await loadOrdersMarketData(repository);

    expect(data.quotes.length).toBeGreaterThan(0);
    expect(data.rate.estimated).toBe(true);
  });

  it('trades maneja empty state cuando no hay operaciones', async () => {
    const repository = new MockRepository();
    jest.spyOn(repository, 'getTrades').mockResolvedValueOnce([]);

    await expect(loadTradeHistoryData(repository)).resolves.toEqual({ trades: [] });
  });
});
