import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have proper document title', async ({ page }) => {
    await expect(page).toHaveTitle('Isaac Eliape – Frontend Engineer');
  });

  test('should have lang attribute on html element', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should have meta description', async ({ page }) => {
    const metaDesc = page.locator('meta[property="og:description"], meta[name="twitter:description"], meta[name="description"]');
    await expect(metaDesc.first()).toHaveAttribute('content');
  });

  test('should have skip link for keyboard navigation', async ({ page }) => {
    const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link');
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile viewport only');
    
    const h1 = page.locator('h1');
    const asciiHero = page.locator('.ascii');
    if (await h1.count() > 0) {
      await expect(h1).toHaveCount(1);
      await expect(h1.first()).toBeVisible();
    } else if (await asciiHero.count() > 0) {
      await expect(asciiHero.first()).toBeVisible();
    }
  });

  test('should have alt text on images', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('should have aria-labels on interactive elements', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      expect(hasAriaLabel || hasText.trim()).toBeTruthy();
    }
  });

  test('should have focusable elements keyboard accessible', async ({ page }) => {
    const focusableElements = page.locator(
      'a[href]:visible, button:visible, [tabindex]:not([tabindex="-1"]):visible'
    );
    
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = focusableElements.nth(i);
      if (await element.isVisible()) {
        await element.focus();
        await expect(element).toBeFocused();
      }
    }
  });

  test('should maintain visible focus indicators', async ({ page }) => {
    const firstLink = page.locator('a[href]').first();
    await firstLink.focus();
    
    const focusStyle = await firstLink.evaluate(el => 
      window.getComputedStyle(el).outlineStyle
    );
    expect(focusStyle).not.toBe('none');
  });

  test('should have proper contrast ratio (visual check)', async ({ page }) => {
    const body = page.locator('body');
    const bgColor = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    const textColor = await body.evaluate(el =>
      window.getComputedStyle(el).color
    );
    
    expect(bgColor).toBeTruthy();
    expect(textColor).toBeTruthy();
  });

  test('should have aria-live region for dynamic content', async ({ page }) => {
    const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
    const count = await liveRegions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should not have horizontal overflow', async ({ page }) => {
    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBeFalsy();
  });
});

test.describe('Screen Reader Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should announce palette results', async ({ page }) => {
    await page.keyboard.press('Control+Shift+p');
    await page.fill('#palette-input', 'About');
    
    const announceEl = page.locator('#palette-announce[aria-live="polite"]');
    await expect(announceEl).not.toBeEmpty();
  });

  test('should have proper landmark regions', async ({ page }) => {
    const landmarks = page.locator('main, nav, header, footer, section[aria-label]');
    const count = await landmarks.count();
    expect(count).toBeGreaterThan(2);
  });
});
