import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;

export const loginSchema = z.object({
  email: z.email({ error: 'validation.email' }),
  password: z.string().min(PASSWORD_MIN_LENGTH, { error: 'validation.passwordMin' }),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
