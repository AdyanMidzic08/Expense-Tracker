import { test, expect } from '@playwright/test';

test('should load the home page and check elements', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL('http://localhost:3000/');
});
