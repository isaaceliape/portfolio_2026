import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
  });

  test('should have theme toggle button', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle');
    await expect(themeBtn).toBeVisible();
  });

  test('should toggle theme when clicking button', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle');
    const html = page.locator('html');
    
    const initialTheme = await html.getAttribute('data-theme');
    await themeBtn.click();
    await page.waitForTimeout(100);
    
    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle');
    const html = page.locator('html');
    
    const initialTheme = await html.getAttribute('data-theme');
    const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';
    
    await themeBtn.click();
    await page.waitForTimeout(100);
    
    const storedTheme = await page.evaluate(() => localStorage.getItem('portfolio-theme'));
    expect(storedTheme).toBe(expectedTheme);
  });

  test('should update button text when theme changes', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle');
    
    const initialText = await themeBtn.textContent();
    await themeBtn.click();
    await page.waitForTimeout(100);
    const newText = await themeBtn.textContent();
    
    expect(newText).not.toBe(initialText);
  });

  test('should change CSS variable when theme changes', async ({ page }) => {
    const body = page.locator('body');
    const themeBtn = page.locator('#theme-toggle');
    
    const initialBg = await body.evaluate(el => 
      window.getComputedStyle(el).getPropertyValue('--bg').trim()
    );
    
    await themeBtn.click();
    await page.waitForTimeout(100);
    
    const newBg = await body.evaluate(el => 
      window.getComputedStyle(el).getPropertyValue('--bg').trim()
    );
    
    expect(newBg).not.toBe(initialBg);
  });
});

test.describe('System Theme Preference', () => {
  test('should respect prefers-color-scheme in CSS', async ({ page }) => {
    await page.goto('/index.html');
    
    const html = page.locator('html');
    const theme = await html.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(theme);
  });
});
