import { env } from '@/shared/config/env';

const KEY = `${env.appName.replace(/\s+/g, '_').toLowerCase()}_access_token`;

export const tokenStorage = {
  get: () => localStorage.getItem(KEY),
  set: (token: string) => localStorage.setItem(KEY, token),
  clear: () => localStorage.removeItem(KEY),
};
