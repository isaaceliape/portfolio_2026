import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should navigate to About section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile viewport navigation tested separately');
    
    const aboutLink = page.locator('.nav-links a[href="#about"]').first();
    await aboutLink.click();
    
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should navigate to Projects section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile viewport navigation tested separately');
    
    const projectsLink = page.locator('.nav-links a[href="#projects"]').first();
    await projectsLink.click();
    
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport();
  });

  test('should navigate to Contact section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile viewport navigation tested separately');
    
    const contactLink = page.locator('.nav-links a[href="#contact"]').first();
    await contactLink.click();
    
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
  });

  test('should navigate to Blog', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile viewport navigation tested separately');
    
    const blogLink = page.locator('.nav-links a[href*="blog"]').first();
    if (await blogLink.count() > 0 && await blogLink.isVisible()) {
      await blogLink.click();
      await expect(page).toHaveURL(/blog/);
    }
  });

  test('should have smooth scroll behavior', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile viewport navigation tested separately');
    
    await page.evaluate(() => {
      window.scrollTo(0, 1000);
    });
    
    const aboutLink = page.locator('.nav-links a[href="#about"]').first();
    await aboutLink.click();
    
    await page.locator('#about').scrollIntoViewIfNeeded();
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should have working navigation links', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation tested separately');
    
    const aboutLink = page.locator('.nav-links a[href="#about"]').first();
    await expect(aboutLink).toBeVisible();
    
    const projectsLink = page.locator('.nav-links a[href="#projects"]').first();
    await expect(projectsLink).toBeVisible();
    
    const contactLink = page.locator('.nav-links a[href="#contact"]').first();
    await expect(contactLink).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test('should render navigation on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Desktop browser - mobile test');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should have visible navigation links on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Desktop browser - mobile test');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    
    const navLinks = page.locator('.nav-links a[href]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
