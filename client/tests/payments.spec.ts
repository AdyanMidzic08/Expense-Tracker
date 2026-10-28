import { test, expect } from '@playwright/test';
import { mockAuthState, mockDashboardApi, TEST_DATABASE_DATA } from './helpers';

test.describe('Payments & Categories Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthState(page, 'admin@example.com');
  });

  test('should display payments list from testData.sql in /payments', async ({
    page,
  }) => {
    // Uses the database test data
    await mockDashboardApi(page);

    await page.goto('/payments');

    await expect(
      page.getByRole('heading', { name: 'All Payments' })
    ).toBeVisible();

    // Verify records from server/testData.sql
    await expect(page.getByText('#INV-2026-001')).toBeVisible();
    await expect(page.getByText('Tech Solutions GmbH')).toBeVisible();
    await expect(page.getByText('$1250.00')).toBeVisible();

    await expect(page.getByText('#INV-2026-006')).toBeVisible();
    await expect(page.getByText('Office Hardware Store')).toBeVisible();
    await expect(page.getByText('$1299.00')).toBeVisible();

    await expect(page.getByText('#INV-2026-015')).toBeVisible();
    await expect(page.getByText('Social Media Boost')).toBeVisible();
  });

  test('should allow creating a new invoice', async ({ page }) => {
    await mockDashboardApi(page);

    // Intercept POST /api/payments
    let paymentCreated = false;
    await page.route('**/api/payments', async (route) => {
      if (route.request().method() === 'POST') {
        paymentCreated = true;
        const postData = route.request().postDataJSON();
        expect(postData.client).toBe('Neue Testfirma AG');
        expect(postData.amount).toBe(750);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Payment created', id: 99 }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DATABASE_DATA.payments),
        });
      }
    });

    await page.goto('/payments/new');

    await expect(
      page.getByRole('heading', { name: 'New Invoice' })
    ).toBeVisible();

    await page.fill('input[placeholder="e.g. Acme Corp"]', 'Neue Testfirma AG');
    await page.fill('input[placeholder="0.00"]', '750');
    await page.selectOption('select:has(option[value="Pending"])', 'Paid');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 5000 });
    expect(paymentCreated).toBe(true);
  });

  test('should display categories from testData.sql and allow creating a new one', async ({
    page,
  }) => {
    await mockDashboardApi(page);

    await page.goto('/categories');
    await expect(
      page.getByRole('heading', { name: 'All Categories' })
    ).toBeVisible();

    // Verify categories from server/testData.sql
    for (const cat of TEST_DATABASE_DATA.categories) {
      await expect(page.getByText(cat.name)).toBeVisible();
    }

    // Navigate to create new category
    await page.getByRole('link', { name: '+ New Category' }).click();
    await expect(page).toHaveURL('/categories/new');

    // Mock POST /api/categories
    let categoryCreated = false;
    await page.route('**/api/categories', async (route) => {
      if (route.request().method() === 'POST') {
        categoryCreated = true;
        const data = route.request().postDataJSON();
        expect(data.name).toBe('Reisen & Transport');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 6, name: data.name }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DATABASE_DATA.categories),
        });
      }
    });

    await page.fill('#name', 'Reisen & Transport');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 5000 });
    expect(categoryCreated).toBe(true);
  });

  test('should render charts page with testData.sql data without error', async ({
    page,
  }) => {
    await mockDashboardApi(page);

    await page.goto('/diagrams');
    await expect(
      page.getByRole('heading', { name: 'Financial Analytics' })
    ).toBeVisible();
    await expect(
      page.getByText('Expenses by Category (Bar Chart)')
    ).toBeVisible();
    await expect(page.getByText('Category Distribution (Share)')).toBeVisible();
  });
});
