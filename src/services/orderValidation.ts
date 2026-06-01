import { z } from 'zod';
import type { CreateOrderInput } from '../types/domain';

const baseSchema = z.object({
  symbol: z.string().trim().min(1, 'Ingresa un símbolo.').max(20),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['LIMIT', 'MARKET']),
  quantity: z.coerce.number().int('Usa una cantidad entera.').positive(),
  limitPrice: z.coerce.number().positive('Ingresa un precio límite válido.').optional(),
});

export type OrderValidationResult =
  | { success: true; data: CreateOrderInput }
  | { success: false; errors: string[] };

export const validateOrderInput = (input: unknown): OrderValidationResult => {
  const parsed = baseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues.map((item) => item.message) };
  }

  const data = {
    ...parsed.data,
    symbol: parsed.data.symbol.toUpperCase(),
    limitPrice: parsed.data.type === 'LIMIT' ? parsed.data.limitPrice : undefined,
  };

  if (data.type === 'LIMIT' && data.limitPrice == null) {
    return { success: false, errors: ['Ingresa precio límite para órdenes LIMIT.'] };
  }

  return { success: true, data };
};
