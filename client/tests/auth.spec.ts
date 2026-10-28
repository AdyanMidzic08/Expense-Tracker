import { test, expect } from '@playwright/test';
import { logInPage, registerPage, mockAuthState, logOut } from './helpers';

test.describe('Authentication Flows', () => {
  test('should display login page elements correctly', async ({ page }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: 'Welcome Back' })
    ).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /register here/i })
    ).toBeVisible();
  });

  test('should successfully log in with valid credentials via helper', async ({
    page,
  }) => {
    await logInPage(page, {
      email: 'adrian@example.com',
      password: 'SecurePassword123!',
    });

    // Should navigate to dashboard /
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: /Adrian's Dashboard/i })
    ).toBeVisible();

    // Verify localStorage has token & userEmail
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const userEmail = await page.evaluate(() =>
      localStorage.getItem('userEmail')
    );
    expect(token).toBeTruthy();
    expect(userEmail).toBe('adrian@example.com');
  });

  test('should show error message when login fails', async ({ page }) => {
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid email or password' }),
      });
    });

    await page.goto('/login');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should register a new user successfully and redirect to login', async ({
    page,
  }) => {
    await registerPage(page, {
      email: 'newuser@example.com',
      password: 'MyPassword123!',
    });

    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated users from protected pages to /login', async ({
    page,
  }) => {
    // Navigate without token in localStorage
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/payments');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/categories');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/diagrams');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should allow authenticated users to log out', async ({ page }) => {
    await mockAuthState(page, 'testuser@example.com');
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Testuser's Dashboard/i })
    ).toBeVisible();

    await logOut(page);

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});
