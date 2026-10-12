import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      restoreMocks: true,
      unstubEnvs: true,
      env: {
        VITE_APP_NAME: 'test',
        // jsdom за замовчуванням працює на http://localhost:3000 — той самий origin, без CORS-preflight
        VITE_API_URL: 'http://localhost:3000/api',
        VITE_DEFAULT_LOCALE: 'en',
        VITE_I18N_SOURCE: 'local',
      },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/test/**', 'src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/**/*.d.ts'],
        reporter: ['text', 'html', 'lcov'],
      },
    },
  }),
);
