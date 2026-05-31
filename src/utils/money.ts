import type { CurrencyCode } from '../types/domain';

export const convertMoney = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  usdclpRate: number,
) => {
  if (from === to) {
    return amount;
  }
  return from === 'USD' ? amount * usdclpRate : amount / usdclpRate;
};

export const formatMoney = (
  amount: number,
  currency: CurrencyCode,
  maximumFractionDigits = currency === 'CLP' ? 0 : 2,
) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(amount);

export const formatSignedPercent = (value: number) => {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
};
