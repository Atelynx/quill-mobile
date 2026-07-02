import type { CurrencyRate, MarketStatus, PortfolioSummary, StockQuote, TradeRecord } from '../types/domain';
import type { DataRepository } from '../services/contracts';
import { getDisplayCurrencyRate } from '../services/currencyRateService';

export interface MarketScreenData {
  market: StockQuote[];
  rate: CurrencyRate;
  status?: MarketStatus;
  statusError?: string;
}

export interface PortfolioScreenData {
  portfolio: PortfolioSummary;
  rate: CurrencyRate;
}

export interface OrdersMarketData {
  quotes: StockQuote[];
  rate: CurrencyRate;
}

export interface TradeHistoryData {
  trades: TradeRecord[];
}

export const loadMarketScreenData = async (
  repository: DataRepository,
): Promise<MarketScreenData> => {
  const rateRequest = getDisplayCurrencyRate(repository);
  const statusRequest = getOptionalMarketStatus(repository);
  const market = await repository.getMarket();
  return { market, rate: await rateRequest, ...await statusRequest };
};

export const loadPortfolioScreenData = async (
  repository: DataRepository,
): Promise<PortfolioScreenData> => {
  const rateRequest = getDisplayCurrencyRate(repository);
  const portfolio = await repository.getPortfolio();
  return { portfolio, rate: await rateRequest };
};

export const loadOrdersMarketData = async (
  repository: DataRepository,
): Promise<OrdersMarketData> => {
  const rateRequest = getDisplayCurrencyRate(repository);
  const quotes = await repository.getMarket();
  return { quotes, rate: await rateRequest };
};

export const loadTradeHistoryData = async (
  repository: DataRepository,
  limit = 20,
): Promise<TradeHistoryData> => ({
  trades: await repository.getTrades(limit),
});

const getOptionalMarketStatus = async (repository: DataRepository) => {
  try {
    return { status: await repository.getMarketStatus() };
  } catch (error) {
    return {
      statusError: error instanceof Error
        ? error.message
        : 'No fue posible cargar el estado de mercado.',
    };
  }
};
