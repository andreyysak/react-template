import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { testToken } from '@/test/mocks/fixtures';
import { api } from '@/test/mocks/handlers';
import { server } from '@/test/mocks/server';
import { renderWithProviders, screen } from '@/test/render';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '../store/auth.store';
import { RequireAuth } from './RequireAuth';

const renderProtectedRoute = () =>
  renderWithProviders(<div>Login page</div>, {
    route: ROUTES.home,
    routes: [
      {
        element: <RequireAuth />,
        children: [{ path: ROUTES.home, element: <div>Protected content</div> }],
      },
    ],
  });

describe('RequireAuth', () => {
  it('redirects a guest to the login page', async () => {
    renderProtectedRoute();

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  it('renders the route for an authenticated user', async () => {
    useAuthStore.getState().setToken(testToken);
    renderProtectedRoute();

    expect(await screen.findByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to login when the token is rejected', async () => {
    server.use(http.get(api('/me'), () => new HttpResponse(null, { status: 401 })));
    useAuthStore.getState().setToken('expired-token');
    renderProtectedRoute();

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
