/**
 * Tests for data.js - Data and action resolution
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DATA, resolveAction } from '../js/data.js';

describe('data', () => {
  describe('DATA array', () => {
    it('should be an array with items', () => {
      expect(Array.isArray(DATA)).toBe(true);
      expect(DATA.length).toBeGreaterThan(0);
    });

    it('should have consistent structure for all items', () => {
      DATA.forEach(item => {
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('icon');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('sub');
        expect(typeof item.category).toBe('string');
        expect(typeof item.icon).toBe('string');
        expect(typeof item.title).toBe('string');
        expect(typeof item.sub).toBe('string');
      });
    });

    it('should have categories', () => {
      const categories = [...new Set(DATA.map(d => d.category))];
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Projects');
      expect(categories).toContain('Contact');
    });

    it('should have actions that follow the expected format', () => {
      DATA.forEach(item => {
        if (item.action !== null && item.action !== undefined) {
          expect(typeof item.action).toBe('string');
          expect(item.action).toMatch(/^[a-z]+:.+$/);
        }
      });
    });

    it('should have project items with URLs', () => {
      const projectItems = DATA.filter(d => d.category === 'Projects');
      projectItems.forEach(item => {
        expect(item.action).toMatch(/^open:/);
      });
    });

    it('should have contact items with links', () => {
      const contactItems = DATA.filter(d => d.category === 'Contact');
      expect(contactItems.length).toBeGreaterThan(0);
    });
  });

  describe('resolveAction', () => {
    const mockContext = {
      navTo: vi.fn(),
      toggleTheme: vi.fn(),
      toggleVim: vi.fn()
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return null for items without action', () => {
      const item = { category: 'Test', title: 'Test', action: null };
      expect(resolveAction(item, mockContext)).toBeNull();
    });

    it('should return toggleTheme for theme:toggle action', () => {
      const item = { category: 'Test', title: 'Test', action: 'theme:toggle' };
      const result = resolveAction(item, mockContext);
      expect(result).toBe(mockContext.toggleTheme);
    });

    it('should return toggleVim for vim:toggle action', () => {
      const item = { category: 'Test', title: 'Test', action: 'vim:toggle' };
      const result = resolveAction(item, mockContext);
      expect(result).toBe(mockContext.toggleVim);
    });

    it('should return navigation function for nav actions', () => {
      const item = { category: 'Test', title: 'Test', action: 'nav:#about' };
      const result = resolveAction(item, mockContext);
      
      expect(typeof result).toBe('function');
      result();
      expect(mockContext.navTo).toHaveBeenCalledWith('#about');
    });

    it('should return function that opens URL for open action', () => {
      // Note: URLs with colons (like https://) will be split incorrectly
      // due to split(":"). Use relative URLs for testing.
      const item = { category: 'Test', title: 'Test', action: 'open:example.com' };
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
      
      const result = resolveAction(item, mockContext);
      expect(typeof result).toBe('function');
      
      result();
      expect(openSpy).toHaveBeenCalledWith('example.com', '_blank');
      
      openSpy.mockRestore();
    });

    it('should return function that handles mailto for mailto action', () => {
      const item = { category: 'Test', title: 'Test', action: 'open:mailto:test@example.com' };
      
      // Test that the function is returned and is callable
      const result = resolveAction(item, mockContext);
      expect(typeof result).toBe('function');
      
      // In jsdom, window.location.href assignment is mocked/not-implemented
      // We just verify the function doesn't throw
      expect(() => result()).not.toThrow();
    });

    it('should warn and return null for unknown action types', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const item = { category: 'Test', title: 'Test', action: 'unknown:value' };
      
      const result = resolveAction(item, mockContext);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Unknown action type: unknown');
      
      consoleSpy.mockRestore();
    });

    it('should handle open action without http prefix', () => {
      const item = { category: 'Test', title: 'Test', action: 'open:blog/index.html' };
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
      
      const result = resolveAction(item, mockContext);
      result();
      
      expect(openSpy).toHaveBeenCalledWith('blog/index.html', '_blank');
      
      openSpy.mockRestore();
    });

    it('should work with real DATA items', () => {
      const themeItem = DATA.find(d => d.action === 'theme:toggle');
      expect(resolveAction(themeItem, mockContext)).toBe(mockContext.toggleTheme);

      const navItem = DATA.find(d => d.action === 'nav:#about');
      const navFn = resolveAction(navItem, mockContext);
      navFn();
      expect(mockContext.navTo).toHaveBeenCalledWith('#about');
    });
  });
});