import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/shared/i18n/locales/en/common.json';

// Синхронна ініціалізація з реальними перекладами — тести шукають елементи за справжніми текстами
void i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  resources: { en: { common: en } },
  interpolation: { escapeValue: false },
  initAsync: false,
});

export default i18n;
