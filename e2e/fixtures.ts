import AxeBuilder from '@axe-core/playwright';
import { test as base, type Page, type Route } from '@playwright/test';
import { E2E_API_URL, E2E_TOKEN_KEY, e2ePassword, e2eToken, e2eUser } from './constants';

type Handler = (route: Route) => Promise<void> | void;

/** Мок API: дефолтні відповіді + можливість перевизначити окремий ендпоінт у тесті */
class ApiMock {
  private overrides = new Map<string, Handler>();
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async init() {
    await this.page.route(`${E2E_API_URL}/**`, async (route) => {
      const request = route.request();
      const path = new URL(request.url()).pathname.replace(new URL(E2E_API_URL).pathname, '');
      const key = `${request.method()} ${path}`;

      const override = this.overrides.get(key);
      if (override) return override(route);

      if (key === 'POST /auth/login') {
        const { email, password } = request.postDataJSON() as { email: string; password: string };
        return email === e2eUser.email && password === e2ePassword
          ? route.fulfill({ json: { accessToken: e2eToken, user: e2eUser } })
          : route.fulfill({ status: 401, json: { message: 'Invalid credentials' } });
      }

      if (key === 'GET /me') {
        return request.headers().authorization === `Bearer ${e2eToken}`
          ? route.fulfill({ json: e2eUser })
          : route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
      }

      return route.fulfill({ status: 404, json: { message: `No mock for ${key}` } });
    });
  }

  /** Напр. api.on('GET /me', (route) => route.fulfill({ status: 500 })) */
  on(key: `${string} /${string}`, handler: Handler) {
    this.overrides.set(key, handler);
  }
}

interface Fixtures {
  api: ApiMock;
  /** Виконує вхід, підкладаючи токен у localStorage до завантаження сторінки */
  login: () => Promise<void>;
  makeAxeBuilder: () => AxeBuilder;
}

export const test = base.extend<Fixtures>({
  api: [
    async ({ page }, use) => {
      const api = new ApiMock(page);
      await api.init();
      await use(api);
    },
    { auto: true },
  ],

  login: async ({ page }, use) => {
    await use(async () => {
      await page.addInitScript(([key, token]) => localStorage.setItem(key, token), [
        E2E_TOKEN_KEY,
        e2eToken,
      ] as const);
    });
  },

  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']),
    );
  },
});

export { expect } from '@playwright/test';
