import type { CurrencyRate } from '../types/domain';

export const ESTIMATED_USDCLP_RATE = 950;

export const estimatedUsdClpRate = (): CurrencyRate => ({
  symbol: 'USDCLP',
  rate: ESTIMATED_USDCLP_RATE,
  basePrice: ESTIMATED_USDCLP_RATE,
  dayChangePercentage: 0,
  estimated: true,
  message: 'Usando tasa estimada.',
});
