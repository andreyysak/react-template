import { expect, test } from './fixtures';

test.describe('accessibility', () => {
  test('login page has no a11y violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

    const { violations } = await makeAxeBuilder().analyze();

    expect(violations).toEqual([]);
  });

  test('home page has no a11y violations', async ({ page, login, makeAxeBuilder }) => {
    await login();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();

    const { violations } = await makeAxeBuilder().analyze();

    expect(violations).toEqual([]);
  });
});
