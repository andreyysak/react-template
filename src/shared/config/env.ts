import { z } from 'zod';

export const SUPPORTED_LOCALES = ['uk', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_API_URL: z.url(),
  VITE_DEFAULT_LOCALE: z.enum(SUPPORTED_LOCALES),
  VITE_I18N_SOURCE: z.enum(['local', 'remote', 'hybrid']),
});

const parsed = envSchema.parse(import.meta.env);

export const env = {
  appName: parsed.VITE_APP_NAME,
  apiUrl: parsed.VITE_API_URL,
  defaultLocale: parsed.VITE_DEFAULT_LOCALE,
  i18nSource: parsed.VITE_I18N_SOURCE,
};
