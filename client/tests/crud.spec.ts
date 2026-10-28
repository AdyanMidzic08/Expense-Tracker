import { test, expect } from '@playwright/test';
import { mockAuthState, mockDashboardApi, TEST_DATABASE_DATA } from './helpers';

test.describe('CRUD Operations: POST, PUT, DELETE for Categories and Payments', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate user via mock auth helper
    await mockAuthState(page, 'admin@example.com');
  });

  // =========================================================================
  // CATEGORIES: POST, PUT, DELETE
  // =========================================================================
  test.describe('Categories CRUD', () => {
    test('POST - should create a new category via UI form', async ({
      page,
    }) => {
      await mockDashboardApi(page);

      let postRequestData: { name?: string } | null = null;
      await page.route('**/api/categories', async (route) => {
        if (route.request().method() === 'POST') {
          postRequestData = route.request().postDataJSON();
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 99,
              name: postRequestData?.name,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(TEST_DATABASE_DATA.categories),
          });
        }
      });

      await page.goto('/categories/new');
      await expect(
        page.getByRole('heading', { name: 'New Category' })
      ).toBeVisible();

      // Enter new category name from UI
      await page.fill('#name', 'Forschung & Entwicklung');
      await page.click('button[type="submit"]');

      // Verify POST payload and redirection back to dashboard
      await expect(page).toHaveURL('/', { timeout: 5000 });
      expect(postRequestData).toEqual({ name: 'Forschung & Entwicklung' });
    });

    test('PUT - should edit and update an existing category', async ({
      page,
    }) => {
      const categoryToEdit = TEST_DATABASE_DATA.categories[0]; // { id: 1, name: 'Software & Tools' }

      let putRequestData: { name?: string } | null = null;
      await page.route(
        `**/api/categories/${categoryToEdit.id}`,
        async (route) => {
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(categoryToEdit),
            });
          } else if (route.request().method() === 'PUT') {
            putRequestData = route.request().postDataJSON();
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                id: categoryToEdit.id,
                name: putRequestData?.name,
              }),
            });
          }
        }
      );

      await page.goto(`/categories/edit/${categoryToEdit.id}`);
      await expect(
        page.getByRole('heading', { name: 'Edit Category' })
      ).toBeVisible();

      // Input should initially have the existing category name
      const nameInput = page.locator('#name');
      await expect(nameInput).toHaveValue(categoryToEdit.name);

      // Change name and submit
      await nameInput.fill('Software, Tools & Subscriptions');
      await page.click('button[type="submit"]');

      // Verify PUT payload and redirect to /categories
      await expect(page).toHaveURL('/categories', { timeout: 5000 });
      expect(putRequestData).toEqual({
        name: 'Software, Tools & Subscriptions',
      });
    });

    test('DELETE - should remove a category and update table upon user confirmation', async ({
      page,
    }) => {
      let currentCategories = [...TEST_DATABASE_DATA.categories];
      const targetCategory = currentCategories[0]; // id 1: Software & Tools
      let deleteCalledWithId: string | null = null;

      // Handle window.confirm dialog automatically
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain(
          'Are you sure you want to delete this Category?'
        );
        await dialog.accept();
      });

      await page.route('**/api/categories', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(currentCategories),
        });
      });

      await page.route(`**/api/categories/*`, async (route) => {
        if (route.request().method() === 'DELETE') {
          const urlParts = route.request().url().split('/');
          deleteCalledWithId = urlParts[urlParts.length - 1];
          currentCategories = currentCategories.filter(
            (c) => c.id !== Number(deleteCalledWithId)
          );
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Category deleted successfully' }),
          });
        }
      });

      await page.goto('/categories');
      await expect(page.getByText(targetCategory.name)).toBeVisible();

      // Click the delete button on the first row
      const deleteButton = page
        .locator('button[title="Delete Category"]')
        .first();
      await deleteButton.click();

      // Verify DELETE API was called with the correct ID
      expect(deleteCalledWithId).toBe(String(targetCategory.id));

      // Verify category is removed from UI immediately
      await expect(page.getByText(targetCategory.name)).not.toBeVisible();
    });
  });

  // =========================================================================
  // PAYMENTS: POST, PUT, DELETE
  // =========================================================================
  test.describe('Payments CRUD', () => {
    test('POST - should create a new payment invoice', async ({ page }) => {
      await mockDashboardApi(page);

      let postRequestData: Record<string, unknown> | null = null;
      await page.route('**/api/payments', async (route) => {
        if (route.request().method() === 'POST') {
          postRequestData = route.request().postDataJSON();
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Invoice created successfully',
              id: 101,
            }),
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

      // Fill in invoice form fields
      await page.fill(
        'input[placeholder="e.g. Acme Corp"]',
        'Global Cloud Services AG'
      );
      await page.fill('input[placeholder="0.00"]', '4250.75');
      await page.selectOption('select:has(option[value="Pending"])', 'Paid');

      // Select category (Software & Tools)
      await page.selectOption('select:has(option[value="1"])', '1');

      await page.click('button[type="submit"]');

      // Verify redirection and payload
      await expect(page).toHaveURL('/', { timeout: 5000 });
      expect(postRequestData).toMatchObject({
        client: 'Global Cloud Services AG',
        amount: 4250.75,
        status: 'Paid',
        category_id: 1,
      });
    });

    test('PUT - should edit and update an existing payment', async ({
      page,
    }) => {
      const paymentToEdit = TEST_DATABASE_DATA.payments[0]; // INV-2026-001, Tech Solutions GmbH, 1250, Paid

      let putRequestData: Record<string, unknown> | null = null;
      await page.route(`**/api/payments/${paymentToEdit.id}`, async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(paymentToEdit),
          });
        } else if (route.request().method() === 'PUT') {
          putRequestData = route.request().postDataJSON();
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              ...paymentToEdit,
              ...putRequestData,
            }),
          });
        }
      });

      await page.goto(`/payments/edit/${paymentToEdit.id}`);
      await expect(
        page.getByRole('heading', {
          name: new RegExp(`Rechnung bearbeiten #${paymentToEdit.invoice_id}`),
        })
      ).toBeVisible();

      // Verify form is pre-filled
      const clientInput = page.locator('input[type="text"]').nth(1); // Second input is client
      await expect(clientInput).toHaveValue(paymentToEdit.client);

      // Edit fields: change client name and amount
      await clientInput.fill('Tech Solutions Enterprise GmbH');
      const amountInput = page.locator('input[type="number"]');
      await amountInput.fill('1850.50');

      await page.click('button[type="submit"]');

      // Verify PUT payload and redirection to /payments
      await expect(page).toHaveURL('/payments', { timeout: 5000 });
      expect(putRequestData).toMatchObject({
        client: 'Tech Solutions Enterprise GmbH',
        amount: 1850.5,
        status: 'Paid',
      });
    });

    test('DELETE - should delete an invoice after confirmation dialog', async ({
      page,
    }) => {
      let currentPayments = [...TEST_DATABASE_DATA.payments];
      const paymentToDelete = currentPayments[0]; // INV-2026-001
      let deleteCalledWithId: string | null = null;

      // Handle window.confirm dialog automatically
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain(
          'Are you sure you want to delete this payment?'
        );
        await dialog.accept();
      });

      await page.route('**/api/payments', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(currentPayments),
        });
      });

      await page.route('**/api/categories', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DATABASE_DATA.categories),
        });
      });

      await page.route(`**/api/payments/*`, async (route) => {
        if (route.request().method() === 'DELETE') {
          const urlParts = route.request().url().split('/');
          deleteCalledWithId = urlParts[urlParts.length - 1];
          currentPayments = currentPayments.filter(
            (p) => p.id !== Number(deleteCalledWithId)
          );
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Payment deleted' }),
          });
        }
      });

      await page.goto('/payments');
      await expect(
        page.getByText(`#${paymentToDelete.invoice_id}`)
      ).toBeVisible();

      // Click delete button for the first invoice row
      const deleteButton = page
        .locator('button[title="Delete Payment"]')
        .first();
      await deleteButton.click();

      // Verify DELETE API call was performed with proper ID
      expect(deleteCalledWithId).toBe(String(paymentToDelete.id));

      // Verify invoice row is removed from table
      await expect(
        page.getByText(`#${paymentToDelete.invoice_id}`)
      ).not.toBeVisible();
    });
  });
});
