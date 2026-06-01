import type { CurrencyRate, StockQuote } from '../types/domain';

export interface PriceUpdateEvent {
  symbol: string;
  price: number;
  dayChangePercentage?: number;
}

export const applyMarketUpdate = (
  quotes: StockQuote[],
  event: PriceUpdateEvent,
) =>
  quotes.map((quote) =>
    quote.symbol === event.symbol
      ? {
          ...quote,
          close: event.price,
          dayChangePercentage: event.dayChangePercentage ?? quote.dayChangePercentage,
        }
      : quote,
  );

export const applyCurrencyUpdate = (
  rate: CurrencyRate,
  event: PriceUpdateEvent,
): CurrencyRate =>
  event.symbol === rate.symbol
    ? {
        ...rate,
        rate: event.price,
        dayChangePercentage: event.dayChangePercentage ?? rate.dayChangePercentage,
        estimated: false,
        message: undefined,
      }
    : rate;
