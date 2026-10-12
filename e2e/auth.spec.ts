import { e2ePassword, e2eUser } from './constants';
import { expect, test } from './fixtures';

test.describe('auth', () => {
  test('redirects a guest to the login page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Enter a valid email')).toBeVisible();
  });

  test('logs in and logs out', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill(e2eUser.email);
    await page.getByLabel('Password', { exact: true }).fill(e2ePassword);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Welcome, ${e2eUser.name}`)).toBeVisible();

    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL('/auth/login');
  });

  test('shows an error for wrong credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill(e2eUser.email);
    await page.getByLabel('Password', { exact: true }).fill('wrong-password');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('redirects to login when the session has expired', async ({ page, api, login }) => {
    api.on('GET /me', (route) => route.fulfill({ status: 401, json: {} }));
    await login();
    await page.goto('/');

    await expect(page).toHaveURL('/auth/login');
  });

  test('opens a protected page for an authenticated user', async ({ page, login }) => {
    await login();
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });
});
