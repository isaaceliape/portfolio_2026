/**
 * Deep unit tests for app.js - Palette logic, Vim mode, navigation, keyboard shortcuts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test app.js functions. Since app.js runs init() on import,
// we test the exported functions and simulate DOM interactions.
// Exported: navTo, toggleVim, openPalette, closePalette, printConsoleArt, toggleTheme

describe('app - navTo', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="about"></section>
      <section id="projects"></section>
      <section id="contact"></section>
    `;
    vi.resetModules();
  });

  it('should scroll to an existing section', async () => {
    // Set up DOM elements app.js expects
    document.body.innerHTML += `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce" role="status" aria-live="polite"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation((q) => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'clear').mockImplementation(() => {});

    const { navTo } = await import('../js/app.js');

    const section = document.getElementById('about');
    const scrollSpy = vi.spyOn(section, 'scrollIntoView');

    navTo('#about');
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});

describe('app - toggleVim', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should toggle vim mode on and off', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { toggleVim } = await import('../js/app.js');
    const vimEl = document.getElementById('vim-indicator');

    toggleVim();
    expect(vimEl.classList.contains('vim-visible')).toBe(true);
    expect(vimEl.textContent).toBe('-- NORMAL --');

    toggleVim();
    expect(vimEl.classList.contains('vim-visible')).toBe(false);
  });
});

describe('app - palette open/close', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should open and close palette', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette, closePalette } = await import('../js/app.js');
    const overlay = document.getElementById('palette-overlay');

    openPalette();
    expect(overlay.classList.contains('open')).toBe(true);

    closePalette();
    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('should populate palette results when opened', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');
    const results = document.getElementById('palette-results');

    openPalette();

    // Results should contain palette items from DATA
    expect(results.innerHTML).toContain('pal-item');
    expect(results.innerHTML).toContain('pal-section-label');
  });

  it('should clear input when palette opens', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" value="old search" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');
    const input = document.getElementById('palette-input');

    openPalette();
    expect(input.value).toBe('');
  });
});

describe('app - printConsoleArt', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should print ASCII art and contact info to console', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { printConsoleArt } = await import('../js/app.js');

    consoleSpy.mockClear();
    printConsoleArt();

    // Should print ASCII art (first call) and contact info (second call)
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    // ASCII art should include block characters
    expect(consoleSpy.mock.calls[0][0]).toContain('██');

    // Contact info should include email
    expect(consoleSpy.mock.calls[1][0]).toContain('isaaceliape@me.com');
  });

  it('should use accent color from CSS variables', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#ff0000'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { printConsoleArt } = await import('../js/app.js');

    consoleSpy.mockClear();
    printConsoleArt();

    // The CSS style string should contain the accent color
    expect(consoleSpy.mock.calls[0][1]).toContain('#ff0000');
  });
});

describe('app - keyboard shortcuts', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should open palette with Ctrl+Shift+P', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await import('../js/app.js');

    const overlay = document.getElementById('palette-overlay');

    // Simulate Ctrl+Shift+P
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'p',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      })
    );

    expect(overlay.classList.contains('open')).toBe(true);
  });

  it('should close palette with Escape', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');
    const overlay = document.getElementById('palette-overlay');

    openPalette();
    expect(overlay.classList.contains('open')).toBe(true);

    // Press Escape
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
    );

    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('should navigate palette with arrow keys', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');

    openPalette();

    // Press ArrowDown
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })
    );

    // First item should be active
    const items = document.querySelectorAll('.pal-item');
    expect(items[0].classList.contains('active')).toBe(true);

    // Press ArrowDown again
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })
    );

    expect(items[0].classList.contains('active')).toBe(false);
    expect(items[1].classList.contains('active')).toBe(true);

    // Press ArrowUp
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      })
    );

    expect(items[0].classList.contains('active')).toBe(true);
  });
});

describe('app - palette search filtering', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should filter results when typing in search', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');
    const input = document.getElementById('palette-input');
    const results = document.getElementById('palette-results');

    openPalette();

    const allItemsCount = results.querySelectorAll('.pal-item').length;

    // Type a search query
    input.value = 'theme';
    input.dispatchEvent(new Event('input'));

    const filteredCount = results.querySelectorAll('.pal-item').length;
    expect(filteredCount).toBeLessThan(allItemsCount);
    expect(filteredCount).toBeGreaterThan(0);

    // Should contain the theme toggle item
    expect(results.innerHTML).toContain('Toggle');
  });

  it('should show no results for non-matching query', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');
    const input = document.getElementById('palette-input');
    const results = document.getElementById('palette-results');

    openPalette();

    // Search for something that doesn't match any item
    input.value = 'xyznonexistent123';
    input.dispatchEvent(new Event('input'));

    expect(results.querySelectorAll('.pal-item').length).toBe(0);
  });

  it('should announce results count to screen readers', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce" aria-live="polite"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
    `;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { openPalette } = await import('../js/app.js');
    const input = document.getElementById('palette-input');
    const announceEl = document.getElementById('palette-announce');

    openPalette();

    // Announce shows results found
    expect(announceEl.textContent).toContain('results found');

    // Search for term that will match some items
    input.value = 'github';
    input.dispatchEvent(new Event('input'));

    expect(announceEl.textContent).toContain('result');
    expect(announceEl.textContent).toContain('found');
  });
});
