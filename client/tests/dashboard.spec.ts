import { test, expect } from '@playwright/test';
import { mockAuthState, mockDashboardApi, TEST_DATABASE_DATA } from './helpers';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthState(page, 'max.mustermann@example.com');
  });

  test('should render dashboard statistics and header correctly using testData.sql', async ({
    page,
  }) => {
    // Uses the database test data (15 payments, 5 categories)
    await mockDashboardApi(page);

    await page.goto('/');

    // Check dashboard user greeting
    await expect(
      page.getByRole('heading', { name: "Max.mustermann's Dashboard" })
    ).toBeVisible();

    // Check KPI cards against testData.sql calculations
    // Total Paid Revenue = 3566.97
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('3566.97')).toBeVisible();

    // Pending Invoices = 3
    await expect(page.getByText('Pending Invoices')).toBeVisible();
    await expect(page.getByText('3', { exact: true })).toBeVisible();

    // Active Categories = 5
    await expect(page.getByText('Active Categories')).toBeVisible();
    await expect(page.getByText('5', { exact: true })).toBeVisible();

    // Check Recent Invoices table displays recent payments from testData.sql
    await expect(
      page.getByRole('heading', { name: 'Recent Invoices' })
    ).toBeVisible();
    await expect(page.getByText('Tech Solutions GmbH')).toBeVisible();
    await expect(page.getByText('Max Mustermann')).toBeVisible();
    await expect(page.getByText('CloudProvider Inc.')).toBeVisible();

    // Shows 3 of 15 recent invoices notice
    await expect(
      page.getByText(
        `Showing 3 of ${TEST_DATABASE_DATA.payments.length} recent invoices.`
      )
    ).toBeVisible();
  });

  test('should have a link to create a new invoice', async ({ page }) => {
    await mockDashboardApi(page);
    await page.goto('/');

    const newInvoiceBtn = page
      .getByRole('link', { name: '+ New Invoice' })
      .first();
    await expect(newInvoiceBtn).toBeVisible();
    await newInvoiceBtn.click();

    await expect(page).toHaveURL('/payments/new');
  });

  test('should navigate via sidebar links', async ({ page }) => {
    await mockDashboardApi(page);
    await page.goto('/');

    // Click Payments in sidebar
    await page.getByRole('link', { name: 'Payments', exact: true }).click();
    await expect(page).toHaveURL('/payments');

    // Click Categories in sidebar
    await page.getByRole('link', { name: 'Categories', exact: true }).click();
    await expect(page).toHaveURL('/categories');

    // Click Diagramm in sidebar
    await page.getByRole('link', { name: 'Diagramm', exact: true }).click();
    await expect(page).toHaveURL('/diagrams');
  });
});
