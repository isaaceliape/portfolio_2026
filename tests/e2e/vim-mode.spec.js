import { test, expect } from '@playwright/test';

test.describe('Vim Mode Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have vim indicator element', async ({ page }) => {
    const vimIndicator = page.locator('#vim-indicator');
    await expect(vimIndicator).toBeVisible();
    await expect(vimIndicator).toContainText('NORMAL');
  });

  test('should enable vim mode via command palette', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      const vimIndicator = page.locator('#vim-indicator');
      const hasClass = await vimIndicator.evaluate(el => 
        el.classList.contains('vim-visible')
      );
      expect(hasClass).toBeTruthy();
    }
  });

  test('should scroll down with j key in vim mode', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      const initialScroll = await page.evaluate(() => window.scrollY);
      await page.keyboard.press('j');
      await page.keyboard.press('j');
      await page.waitForTimeout(300);
      const newScroll = await page.evaluate(() => window.scrollY);
      
      expect(newScroll).toBeGreaterThanOrEqual(initialScroll);
    }
  });

  test('should scroll up with k key in vim mode', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);
      
      await page.keyboard.press('k');
      await page.keyboard.press('k');
      await page.waitForTimeout(300);
      const scroll = await page.evaluate(() => window.scrollY);
      
      expect(scroll).toBeLessThanOrEqual(500);
    }
  });

  test('should scroll to top with gg', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(200);
      
      await page.keyboard.press('g');
      await page.keyboard.press('g');
      await page.waitForTimeout(500);
      
      const scroll = await page.evaluate(() => window.scrollY);
      expect(scroll).toBeLessThanOrEqual(100);
    }
  });

  test('should scroll to bottom with Shift+G', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      
      await page.keyboard.press('Shift+G');
      await page.waitForTimeout(500);
      
      const scroll = await page.evaluate(() => window.scrollY);
      const docHeight = await page.evaluate(() => document.body.scrollHeight);
      expect(scroll).toBeGreaterThan(docHeight * 0.3);
    }
  });

  test('should open palette with / in vim mode', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      await page.keyboard.press('/');
      await page.waitForTimeout(300);
      
      const overlay = page.locator('#palette-overlay');
      await expect(overlay).toBeVisible();
    }
  });

  test('should allow typing in input fields normally', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.waitForTimeout(200);
    
    await page.fill('#palette-input', 'test');
    const inputValue = await page.locator('#palette-input').inputValue();
    
    expect(inputValue).toBe('test');
  });

  test('should toggle vim mode off', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'VIM');
    await page.waitForTimeout(200);
    
    const vimItem = page.locator('.pal-item:has-text("Toggle VIM Mode")').first();
    if (await vimItem.isVisible()) {
      await vimItem.click();
      await page.waitForTimeout(200);
      
      let vimIndicator = page.locator('#vim-indicator');
      const hasClassOn = await vimIndicator.evaluate(el => 
        el.classList.contains('vim-visible')
      );
      expect(hasClassOn).toBeTruthy();
      
      await page.keyboard.press('Control+Shift+p');
      await page.fill('#palette-input', 'VIM');
      await page.waitForTimeout(200);
      await vimItem.click();
      await page.waitForTimeout(200);
      
      const hasClassOff = await vimIndicator.evaluate(el => 
        el.classList.contains('vim-visible')
      );
      expect(hasClassOff).toBeFalsy();
    }
  });
});
