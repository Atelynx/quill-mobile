import type { CurrencyCode, PricePoint, StockQuote } from '../types/domain';
import { convertMoney } from './money';

export const buildDemoHistory = (quote: StockQuote, limit = 24): PricePoint[] => {
  const start = quote.previousClose || quote.close;
  const steps = Math.max(limit, 2);
  return Array.from({ length: steps }, (_, index) => {
    const progress = index / (steps - 1);
    const wave = Math.sin(index * 0.9) * quote.close * 0.006;
    const price = start + (quote.close - start) * progress + wave;
    return {
      symbol: quote.symbol,
      price: Number(price.toFixed(2)),
      createdAt: new Date(Date.now() - (steps - index) * 60 * 60 * 1000).toISOString(),
    };
  });
};

export const normalizeHistory = (items: PricePoint[]) =>
  [...items]
    .filter((item) => Number.isFinite(item.price) && Boolean(item.createdAt))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

export const historyRange = (items: PricePoint[]) => {
  const prices = items.map((item) => item.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const convertHistoryCurrency = (
  data: PricePoint[],
  from: CurrencyCode,
  to: CurrencyCode,
  rate: number,
) => data.map((item) => ({ ...item, price: convertMoney(item.price, from, to, rate) }));
