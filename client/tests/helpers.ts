import { Page, expect } from '@playwright/test';
import { TEST_DATABASE_DATA, TestCategory, TestPayment } from './testData';

/**
 * Standard test user credentials and constants
 */
export const TEST_USER = {
  email: 'testuser@example.com',
  password: 'Password123!',
};

/**
 * Sets authenticated state via localStorage in the browser context.
 * Bypasses login redirect without requiring backend interaction.
 */
export async function mockAuthState(
  page: Page,
  email: string = TEST_USER.email,
  token: string = 'fake-jwt-token'
) {
  await page.addInitScript(
    ({ mockEmail, mockToken }) => {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userEmail', mockEmail);
    },
    { mockEmail: email, mockToken: token }
  );
}

/**
 * Navigates to the login page and fills & submits credentials.
 * Intercepts /api/login unless mockApi is false.
 */
export async function logInPage(
  page: Page,
  options: {
    email?: string;
    password?: string;
    mockApi?: boolean;
    token?: string;
  } = {}
) {
  const email = options.email ?? TEST_USER.email;
  const password = options.password ?? TEST_USER.password;
  const mockApi = options.mockApi ?? true;

  if (mockApi) {
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: options.token ?? 'mocked-jwt-token-xyz',
          user: { id: 1, email },
        }),
      });
    });
  }

  await page.goto('/login');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
}

/**
 * Navigates to the register page and registers an account.
 */
export async function registerPage(
  page: Page,
  options: {
    email?: string;
    password?: string;
    mockApi?: boolean;
  } = {}
) {
  const email = options.email ?? `newuser-${Date.now()}@example.com`;
  const password = options.password ?? TEST_USER.password;
  const mockApi = options.mockApi ?? true;

  if (mockApi) {
    await page.route('**/api/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User registered successfully',
        }),
      });
    });
  }

  await page.goto('/register');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
}

/**
 * Helper to mock payments & categories API responses using server/testData.sql data.
 * Guarantees tests run reliably and identically both locally and in CI/CD server mode.
 */
export async function mockDashboardApi(
  page: Page,
  data: {
    payments?: TestPayment[];
    categories?: TestCategory[];
  } = {}
) {
  const categories = data.categories ?? TEST_DATABASE_DATA.categories;
  const payments = data.payments ?? TEST_DATABASE_DATA.payments;

  await page.route('**/api/categories', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(categories),
    });
  });

  await page.route('**/api/payments', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payments),
    });
  });
}

/**
 * Logs out the current user via the sidebar logout button.
 */
export async function logOut(page: Page) {
  const logoutButton = page.getByRole('button', { name: /abmelden/i });
  await logoutButton.click();
  await expect(page).toHaveURL(/\/login/);
}

export { TEST_DATABASE_DATA };
