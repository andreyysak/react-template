import { describe, expect, it } from 'vitest';
import { loginSchema } from './types';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '12345678' }).success).toBe(true);
  });

  it.each([
    [{ email: 'not-an-email', password: '12345678' }, 'validation.email'],
    [{ email: 'a@b.com', password: 'short' }, 'validation.passwordMin'],
  ])('rejects %o with %s', (input, message) => {
    const result = loginSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });
});
