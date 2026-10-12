# React Template

Шаблон для React-проєктів: **React 19 + TypeScript + Vite**, Mantine, React Query, Zustand,
React Router, React Hook Form + Zod, i18next.

## Вимоги

- Node.js **v24.14.0** (`nvm use` підхопить версію з `.nvmrc`)

## Старт

```bash
cp .env.example .env
npm install
npm run dev
```

## Скрипти

| Команда                    | Опис                                      |
| -------------------------- | ----------------------------------------- |
| `npm run dev`              | dev-сервер                                |
| `npm run build`            | перевірка типів + production-збірка       |
| `npm run preview`          | перегляд збірки                           |
| `npm run lint`             | ESLint (`lint:fix` — з автофіксом)        |
| `npm run format`           | Prettier                                  |
| `npm run typecheck`        | перевірка типів                           |
| `npm test`                 | Vitest у watch-режимі                     |
| `npm run test:run`         | Vitest одноразово                         |
| `npm run test:ui`          | Vitest UI в браузері                      |
| `npm run test:coverage`    | покриття (`coverage/index.html`)          |
| `npm run test:e2e`         | Playwright e2e (`test:e2e:ui` — UI-режим) |
| `npm run test:e2e:install` | встановити браузери Playwright            |

Pre-commit хук (husky + lint-staged) запускає ESLint, Prettier і пов'язані Vitest-тести для змінених файлів.

## Змінні оточення

Валідуються через Zod у `src/shared/config/env.ts` — застосунок не стартує з некоректним `.env`.

| Змінна                | Опис                                          |
| --------------------- | --------------------------------------------- |
| `VITE_APP_NAME`       | назва застосунку (title, ключ токена)         |
| `VITE_API_URL`        | базовий URL API                               |
| `VITE_DEFAULT_LOCALE` | `uk` \| `en`                                  |
| `VITE_I18N_SOURCE`    | `local` \| `remote` \| `hybrid` (API → файли) |

## Тестування

### Юніт і компонентні тести — Vitest + Testing Library + MSW

- Тести лежать поруч із кодом: `Component.tsx` → `Component.test.tsx`.
- Середовище — jsdom; env-змінні для тестів задані у `vitest.config.ts` (`.env` не потрібен).
- `src/test/render.tsx` — `renderWithProviders` (Mantine, React Query, роутер, Toaster) і
  `renderHookWithProviders`. Повертає також `user` (user-event):

  ```tsx
  const { user } = renderWithProviders(<LoginForm />, {
    route: '/auth/login',
    routes: [{ path: '/', element: <div>Home</div> }],
  });
  await user.click(screen.getByRole('button', { name: 'Log in' }));
  ```

- API мокається через MSW: дефолтні хендлери — `src/test/mocks/handlers.ts`, тестові дані —
  `fixtures.ts`. Перевизначити відповідь в окремому тесті:
  `server.use(http.get(api('/me'), () => HttpResponse.json({}, { status: 500 })))`.
  Запит без хендлера валить тест.
- Між тестами автоматично очищуються DOM, `localStorage`, MSW-хендлери, моки (`vi.spyOn`),
  `vi.stubEnv` і стан усіх Zustand-сторів (`__mocks__/zustand.ts`).
- i18n у тестах ініціалізується синхронно англійською — шукайте елементи за реальними текстами.

### E2E — Playwright

```bash
npm run test:e2e:install   # один раз — браузери
npm run test:e2e
```

- Тести в `e2e/`, запускаються проти production-збірки (`build` + `preview`, порт 4173) у
  Chromium, Firefox, WebKit і мобільному Chrome. Один браузер: `npm run test:e2e -- --project=chromium`.
- Бекенд не потрібен: фікстура `api` (`e2e/fixtures.ts`) перехоплює запити до API через
  `page.route`. Перевизначення: `api.on('GET /me', (route) => route.fulfill({ status: 500 }))`.
- Фікстура `login()` підкладає токен у `localStorage` до завантаження сторінки — без UI-входу.
- `makeAxeBuilder()` — перевірка доступності (WCAG 2.1 AA) через axe-core.
- При падінні зберігаються скриншот, відео й trace (`npx playwright show-report`).
- Щоб ганяти тести проти справжнього бекенду, приберіть фікстуру `api` і задайте `E2E_API_URL`
  у `e2e/constants.ts`.

### CI

`.github/workflows/ci.yml`: lint → typecheck → тести з покриттям, і паралельно e2e у всіх
браузерах; звіти покриття і Playwright зберігаються як артефакти.

## Структура

```
src/
  app/        ініціалізація: провайдери, роутер, layouts, глобальні стилі
  pages/      сторінки — збирають фічі, мінімум логіки
  features/   бізнес-фічі (auth, ...)
    <name>/
      components/  queries/  services/  store/  types.ts
      index.ts     публічний API фічі
  shared/     перевикористовуване без бізнес-логіки: config, services, hooks, i18n, types, utils
  test/       налаштування тестів: setup, render-хелпери, MSW-моки
e2e/          Playwright-тести та фікстури
__mocks__/    моки npm-модулів для Vitest
```

Правила:

- Фічу імпортують лише через її `index.ts` (`@/features/auth`) — це перевіряє ESLint.
  Всередині фічі — відносні імпорти.
- Серверний стан — React Query (ключі у `queries/keys.ts`), клієнтський — Zustand.
- Кольори, шрифти, радіуси задаються в `src/shared/config/theme.ts`. У SCSS-модулях
  використовуйте аліаси з `@/app/styles/general/vars` — вони працюють і в темній темі.
- Тексти — лише через `t()`; переклади в `src/shared/i18n/locales/<lng>/common.json`.

## Авторизація

- Токен зберігається в `localStorage` і в `useAuthStore` (для реактивності).
- Користувач — `useMe()` (React Query).
- Захищені маршрути — всередині layout-маршруту `<RequireAuth />`; при 401 — редирект на вхід,
  інші помилки `/me` показує сторінка помилки.
- Сторінки лише для гостей (вхід) — всередині `<GuestOnly />`; після входу повертає на сторінку,
  з якої перенаправили.
- На 401 (крім `/auth/login`) токен і кеш очищуються, `RequireAuth` перенаправляє на вхід без
  перезавантаження сторінки.
