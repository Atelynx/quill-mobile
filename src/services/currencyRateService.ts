import type { CurrencyRate } from '../types/domain';
import type { DataRepository } from './contracts';
import { estimatedUsdClpRate } from './currencyFallback';

export const getDisplayCurrencyRate = async (
  repository: DataRepository,
): Promise<CurrencyRate> => {
  try {
    return await repository.getCurrencyRate();
  } catch {
    return estimatedUsdClpRate();
  }
};
