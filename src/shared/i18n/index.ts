import i18n from 'i18next';
import ChainedBackend, { type ChainedBackendOptions } from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { env, SUPPORTED_LOCALES } from '@/shared/config/env';

const localBackend = resourcesToBackend(
  (lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`),
);

const httpOptions = {
  loadPath: `${env.apiUrl}/translations/{{lng}}/{{ns}}`,
};

const backends: Record<typeof env.i18nSource, ChainedBackendOptions> = {
  local: { backends: [localBackend], backendOptions: [{}] },
  remote: { backends: [HttpBackend], backendOptions: [httpOptions] },
  hybrid: { backends: [HttpBackend, localBackend], backendOptions: [httpOptions, {}] },
};

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

void i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init<ChainedBackendOptions>({
    backend: backends[env.i18nSource],
    lng: env.defaultLocale,
    fallbackLng: 'uk',
    supportedLngs: SUPPORTED_LOCALES,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
