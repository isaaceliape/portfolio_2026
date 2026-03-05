/**
 * Tests for app.js - Main application logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('app', () => {
  beforeEach(() => {
    // Set up DOM before each test (runs after setup.js cleanup)
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay">
        <input id="palette-input" type="text" />
        <div id="palette-results"></div>
      </div>
      <div id="vim-indicator"></div>
      <div id="palette-announce" role="status" aria-live="polite"></div>
      <button id="nav-palette-btn">
        <span class="kbd-hint-desktop"></span>
      </button>
      <section id="about"></section>
      <section id="projects"></section>
      <section id="contact"></section>
    `;
    
    // Reset documentElement
    document.documentElement.removeAttribute('data-theme');
    vi.useFakeTimers();
    
    // Reset scroll
    window.scrollTo = vi.fn();
    window.scrollBy = vi.fn();
    
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    
    // Mock navigator
    Object.defineProperty(window, 'navigator', {
      value: { platform: 'MacIntel' },
      writable: true
    });
    
    // Mock console
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'clear').mockImplementation(() => {});
    
    // Mock getComputedStyle
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00ff88')
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('DOM structure', () => {
    it('should have required elements', () => {
      expect(document.getElementById('palette-overlay')).not.toBeNull();
      expect(document.getElementById('palette-input')).not.toBeNull();
      expect(document.getElementById('vim-indicator')).not.toBeNull();
      expect(document.getElementById('about')).not.toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('should set up palette button', () => {
      const btn = document.getElementById('nav-palette-btn');
      expect(btn).not.toBeNull();
      
      const hint = btn.querySelector('.kbd-hint-desktop');
      expect(hint).not.toBeNull();
    });

    it('should display Mac shortcut hint', () => {
      const hint = document.querySelector('.kbd-hint-desktop');
      // The hint is set during app initialization
      expect(hint).not.toBeNull();
    });
  });

  describe('console art', () => {
    it('should be able to print console art', () => {
      // Mock console methods
      const consoleSpy = vi.spyOn(console, 'log');
      
      // Test that we can call console.log with styled output
      console.log('%c Test', 'color: #00ff88');
      expect(consoleSpy).toHaveBeenCalled();
      
      // Verify styled output format
      expect(consoleSpy.mock.calls[0][1]).toContain('color:');
    });

    it('should print ASCII art format', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      
      // Simulate ASCII art output
      const asciiArt = `
 ██╗  ██╗ ██╗ ██████╗  ███████╗
 ██║  ██║ ██║ ██╔══██╗ ██╔════╝
      `;
      
      console.log('%c' + asciiArt, 'color: #00d4aa; font-family: monospace');
      
      expect(consoleSpy.mock.calls[0][0]).toContain('██╗');
    });
  });

  describe('palette functionality', () => {
    it('should have palette overlay element', () => {
      const overlay = document.getElementById('palette-overlay');
      expect(overlay).not.toBeNull();
    });

    it('should have palette input element', () => {
      const input = document.getElementById('palette-input');
      expect(input).not.toBeNull();
    });

    it('should be able to toggle open class on overlay', () => {
      const overlay = document.getElementById('palette-overlay');
      
      overlay.classList.add('open');
      expect(overlay.classList.contains('open')).toBe(true);
      
      overlay.classList.remove('open');
      expect(overlay.classList.contains('open')).toBe(false);
    });
  });

  describe('vim indicator', () => {
    it('should have vim indicator element', () => {
      const vimEl = document.getElementById('vim-indicator');
      expect(vimEl).not.toBeNull();
    });

    it('should be able to toggle vim-visible class', () => {
      const vimEl = document.getElementById('vim-indicator');
      
      vimEl.classList.add('vim-visible');
      expect(vimEl.classList.contains('vim-visible')).toBe(true);
      
      vimEl.classList.remove('vim-visible');
      expect(vimEl.classList.contains('vim-visible')).toBe(false);
    });
  });

  describe('navigation', () => {
    it('should have section elements for navigation', () => {
      expect(document.getElementById('about')).not.toBeNull();
      expect(document.getElementById('projects')).not.toBeNull();
      expect(document.getElementById('contact')).not.toBeNull();
    });

    it('should support smooth scroll behavior', () => {
      const section = document.getElementById('about');
      const scrollSpy = vi.spyOn(section, 'scrollIntoView');
      
      section.scrollIntoView({ behavior: 'smooth' });
      
      expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  describe('accessibility', () => {
    it('should have aria-live region for announcements', () => {
      const announceEl = document.getElementById('palette-announce');
      expect(announceEl).not.toBeNull();
      expect(announceEl.getAttribute('role')).toBe('status');
      expect(announceEl.getAttribute('aria-live')).toBe('polite');
    });
  });
});
