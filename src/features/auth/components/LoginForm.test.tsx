import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { testPassword, testToken, testUser } from '@/test/mocks/fixtures';
import { api } from '@/test/mocks/handlers';
import { server } from '@/test/mocks/server';
import { renderWithProviders, screen } from '@/test/render';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '../store/auth.store';
import { LoginForm } from './LoginForm';

const renderLoginForm = () =>
  renderWithProviders(<LoginForm />, {
    route: ROUTES.login,
    routes: [{ path: ROUTES.home, element: <div>Home page</div> }],
  });

describe('LoginForm', () => {
  it('shows validation errors for invalid input', async () => {
    const { user } = renderLoginForm();

    await user.type(screen.getByLabelText('Email'), 'wrong');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('logs in and redirects to the home page', async () => {
    const { user } = renderLoginForm();

    await user.type(screen.getByLabelText('Email'), testUser.email);
    await user.type(screen.getByLabelText('Password'), testPassword);
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Home page')).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBe(testToken);
  });

  it('shows the API error message', async () => {
    server.use(
      http.post(api('/auth/login'), () =>
        HttpResponse.json({ message: 'Account is locked' }, { status: 403 }),
      ),
    );
    const { user } = renderLoginForm();

    await user.type(screen.getByLabelText('Email'), testUser.email);
    await user.type(screen.getByLabelText('Password'), testPassword);
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Account is locked')).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
