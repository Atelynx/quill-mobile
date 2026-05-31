import { demoCurrencyRate, demoQuotes } from '../src/mocks/demoData';
import { applyCurrencyUpdate, applyMarketUpdate } from '../src/utils/realtimeUpdates';

describe('realtime updates', () => {
  it('actualiza el precio de una cotización existente', () => {
    const updated = applyMarketUpdate(demoQuotes, {
      symbol: 'COPEC.SN',
      price: 7500,
      dayChangePercentage: 2.2,
    });

    expect(updated.find((quote) => quote.symbol === 'COPEC.SN')?.close).toBe(7500);
    expect(updated.find((quote) => quote.symbol === 'COPEC.SN')?.dayChangePercentage).toBe(2.2);
  });

  it('actualiza la tasa USDCLP cuando llega evento forex', () => {
    const updated = applyCurrencyUpdate(demoCurrencyRate, {
      symbol: 'USDCLP',
      price: 940,
    });

    expect(updated.rate).toBe(940);
  });
});
