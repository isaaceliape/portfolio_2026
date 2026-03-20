import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should render correctly on mobile', async ({ page }) => {
    await page.setViewportSize(viewports[0]);
    
    await expect(page.locator('body')).toBeVisible();
    
    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBeFalsy();
  });

  test('should render correctly on tablet', async ({ page }) => {
    await page.setViewportSize(viewports[1]);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should render correctly on desktop', async ({ page }) => {
    await page.setViewportSize(viewports[2]);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should adjust navigation for mobile', async ({ page }) => {
    await page.setViewportSize(viewports[0]);
    await page.reload();
    
    const desktopNav = page.locator('.desktop-nav, nav:not(.mobile)');
    const mobileNav = page.locator('.mobile-nav, .mobile-menu, [aria-label*="mobile"]');
    
    const desktopNavVisible = await desktopNav.isVisible().catch(() => false);
    const mobileNavVisible = await mobileNav.isVisible().catch(() => false);
    
    expect(desktopNavVisible || mobileNavVisible).toBeTruthy();
  });

  test('should maintain readable text on all screen sizes', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      
      const bodyFontSize = await page.evaluate(() => 
        parseFloat(window.getComputedStyle(document.body).fontSize)
      );
      
      expect(bodyFontSize).toBeGreaterThanOrEqual(14);
    }
  });

  test('should have touch-friendly tap targets on mobile', async ({ page }) => {
    await page.setViewportSize(viewports[0]);
    await page.reload();
    
    const buttons = page.locator('button:visible, a[href]:visible');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(36);
        expect(box.height).toBeGreaterThanOrEqual(36);
      }
    }
  });
});

test.describe('Cross-Browser Compatibility', () => {
  test('should work in Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium only');
    
    await page.goto('/index.html');
    await expect(page).toHaveTitle('Isaac Eliape – Frontend Engineer');
  });

  test('should work on Mobile Chrome', async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== 'chromium' || !isMobile, 'Mobile Chrome only');
    
    await page.goto('/index.html');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on Mobile Safari', async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== 'webkit' || !isMobile, 'Mobile Safari only');
    
    await page.goto('/index.html');
    await expect(page.locator('body')).toBeVisible();
  });
});
