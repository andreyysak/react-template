import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';
import { testPassword, testToken, testUser } from './fixtures';

const api = (path: string) => `${env.apiUrl}${path}`;

// Хендлери «щасливого шляху». Окремий тест перевизначає їх через server.use(...)
export const handlers = [
  http.post(api('/auth/login'), async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (email !== testUser.email || password !== testPassword) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return HttpResponse.json({ accessToken: testToken, user: testUser });
  }),

  http.get(api('/me'), ({ request }) => {
    if (request.headers.get('Authorization') !== `Bearer ${testToken}`) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(testUser);
  }),
];

export { api };
