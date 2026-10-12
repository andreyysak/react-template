import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@/app/styles/index.scss';
import '@/shared/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
