import { test, expect } from '@playwright/test';

test.describe('Portfolio Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should display correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Isaac Eliape – Frontend Engineer');
  });

  test('should display main navigation', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should have all main sections', async ({ page }) => {
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('should display hero section with name', async ({ page }) => {
    const hero = page.locator('section#hero');
    await expect(hero).toBeVisible();
    const ascii = page.locator('.ascii');
    await expect(ascii).toHaveCount(1);
  });
});
