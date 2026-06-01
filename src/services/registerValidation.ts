import { z } from 'zod';
import type { RegisterInput } from '../types/domain';

const schema = z.object({
  fullName: z.string().trim().min(3, 'Ingresa tu nombre completo.'),
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export type RegisterValidationResult =
  | { success: true; data: RegisterInput }
  | { success: false; errors: string[] };

export const validateRegisterInput = (input: unknown): RegisterValidationResult => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues.map((item) => item.message) };
  }

  return {
    success: true,
    data: { ...parsed.data, email: parsed.data.email.toLowerCase() },
  };
};
