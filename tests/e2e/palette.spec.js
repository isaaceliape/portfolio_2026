import { test, expect } from '@playwright/test';

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should open palette with keyboard shortcut (Cmd/Ctrl+Shift+P)', async ({ page, context }) => {
    const isMac = await context.evaluate(() => navigator.platform.toLowerCase().includes('mac'));
    const modifiers = isMac ? ['Meta'] : ['Control'];
    
    await page.keyboard.press([...modifiers, 'Shift', 'P'].join('+'));
    
    const overlay = page.locator('#palette-overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveClass(/open/);
  });

  test('should open palette when clicking navbar button', async ({ page }) => {
    const paletteBtn = page.locator('#nav-palette-btn');
    await paletteBtn.click();
    
    const overlay = page.locator('#palette-overlay');
    await expect(overlay).toBeVisible();
  });

  test('should close palette with Escape key', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await expect(page.locator('#palette-overlay')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.locator('#palette-overlay')).not.toBeVisible();
  });

  test('should close palette when clicking outside', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await expect(page.locator('#palette-overlay')).toBeVisible();
    
    await page.mouse.click(0, 0);
    await expect(page.locator('#palette-overlay')).not.toBeVisible();
  });

  test('should focus input when palette opens', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    
    const input = page.locator('#palette-input');
    await expect(input).toBeFocused();
  });

  test('should display navigation commands', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    
    const results = page.locator('#palette-results');
    await expect(results).toBeVisible();
    await expect(results.locator('.pal-item').first()).toBeVisible();
  });

  test('should filter results when typing', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'About');
    
    const results = page.locator('#palette-results');
    const items = results.locator('.pal-item');
    
    await expect(items.first()).toBeVisible();
    await expect(items.first()).toContainText(/About/i);
  });

  test('should navigate results with arrow keys', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.keyboard.press('ArrowDown');
    
    const firstItem = page.locator('.pal-item[data-idx="0"]');
    await expect(firstItem).toHaveClass(/active/);
    
    await page.keyboard.press('ArrowDown');
    const secondItem = page.locator('.pal-item[data-idx="1"]');
    await expect(secondItem).toHaveClass(/active/);
    
    await page.keyboard.press('ArrowUp');
    await expect(firstItem).toHaveClass(/active/);
  });

  test('should activate item with Enter key', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'About');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('#palette-overlay')).not.toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
  });

  test('should show platform-specific keyboard hint', async ({ page, context }) => {
    const isMac = await context.evaluate(() => navigator.platform.toLowerCase().includes('mac'));
    const hint = page.locator('.kbd-hint-desktop');
    const hintText = await hint.textContent();
    
    if (isMac) {
      expect(hintText).toContain('⌘');
    } else {
      expect(hintText).toContain('Ctrl');
    }
  });

  test('should display "No results" for non-matching search', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'xyz123nonexistent');
    
    const results = page.locator('#palette-results');
    await expect(results).toBeEmpty();
  });

  test('should group items by category when showing all', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    
    const sections = page.locator('.pal-section-label');
    await expect(sections.first()).toBeVisible();
  });

  test('should announce results for screen readers', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'About');
    
    const announceEl = page.locator('#palette-announce');
    await expect(announceEl).not.toBeEmpty();
  });
});
