import { z } from 'zod';
import type { RegisterInput } from '../types/domain';

const schema = z.object({
  fullName: z.string().trim().min(3, 'Ingresa tu nombre completo.'),
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  username: z
    .string()
    .trim()
    .min(3, 'El username debe tener al menos 3 caracteres.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Usa sólo letras, números y guion bajo en username.')
    .optional()
    .or(z.literal('')),
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
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      username: parsed.data.username ? parsed.data.username.toLowerCase() : undefined,
    },
  };
};
