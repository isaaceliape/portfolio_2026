/**
 * Tests for animations.js - Animation functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  prefersReducedMotion, 
  initCursorGlow, 
  initTypewriter, 
  initRevealAnimations,
  initAnimations 
} from '../js/animations.js';

describe('animations', () => {
  let matchMediaMock;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    
    // Mock matchMedia with all required methods
    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('prefersReducedMotion', () => {
    it('should return true when user prefers reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: true });
      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false when user does not prefer reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: false });
      expect(prefersReducedMotion()).toBe(false);
    });

    it('should check prefers-reduced-motion: reduce media query', () => {
      prefersReducedMotion();
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('initCursorGlow', () => {
    beforeEach(() => {
      const glowEl = document.createElement('div');
      glowEl.id = 'cursor-glow';
      document.body.appendChild(glowEl);
    });

    it('should add event listener for mousemove', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      initCursorGlow();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should update CSS variables on mousemove', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const glowEl = document.getElementById('cursor-glow');
      const setPropertySpy = vi.spyOn(glowEl.style, 'setProperty');
      
      initCursorGlow();
      
      // Simulate mouse move
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200
      });
      document.dispatchEvent(mouseEvent);

      expect(setPropertySpy).toHaveBeenCalledWith('--cursor-x', '100px');
      expect(setPropertySpy).toHaveBeenCalledWith('--cursor-y', '200px');
    });

    it('should not throw if cursor glow element does not exist', () => {
      document.body.innerHTML = '';
      expect(() => initCursorGlow()).not.toThrow();
    });

    it('should disable cursor glow when user prefers reduced motion', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const glowEl = document.getElementById('cursor-glow');
      initCursorGlow();

      expect(glowEl.classList.contains('cursor-glow-disabled')).toBe(true);
    });

    it('should not add mousemove listener when reduced motion is preferred', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      initCursorGlow();

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });

  describe('initTypewriter', () => {
    beforeEach(() => {
      const twEl = document.createElement('span');
      twEl.id = 'tw';
      document.body.appendChild(twEl);
    });

    it('should not throw if typewriter element does not exist', () => {
      document.body.innerHTML = '';
      expect(() => initTypewriter()).not.toThrow();
    });

    it('should show first line immediately when reduced motion is preferred', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const twEl = document.getElementById('tw');
      initTypewriter();

      expect(twEl.textContent).toBe('ls projects/');
    });

    it('should start animation after delay when motion is not reduced', () => {
      // Ensure matchMedia returns object with matches: false
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const twEl = document.getElementById('tw');
      initTypewriter();

      expect(twEl.textContent).toBe('');

      // Fast-forward initial delay + enough time to type first character
      vi.advanceTimersByTime(2200 + 90);
      
      // Should have started typing
      expect(twEl.textContent.length).toBeGreaterThanOrEqual(1);
    });

    it('should type characters over time', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const twEl = document.getElementById('tw');
      initTypewriter();

      // Fast-forward past initial delay
      vi.advanceTimersByTime(2200);
      const initialLength = twEl.textContent.length;

      // Advance enough time for several characters
      vi.advanceTimersByTime(270);
      
      // Should have typed more characters
      expect(twEl.textContent.length).toBeGreaterThan(initialLength);
    });

    it('should eventually complete typing first line', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const twEl = document.getElementById('tw');
      initTypewriter();

      // Fast-forward past initial delay + time to type full first line (12 chars * 90ms)
      vi.advanceTimersByTime(2200 + (12 * 90));

      // Should have completed first line
      expect(twEl.textContent).toBe('ls projects/');
    });

    it('should pause after typing full line before deleting', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const twEl = document.getElementById('tw');
      initTypewriter();

      // Type full first line
      vi.advanceTimersByTime(2200 + (12 * 90));
      expect(twEl.textContent).toBe('ls projects/');

      // During pause, text should remain
      vi.advanceTimersByTime(1000);
      expect(twEl.textContent).toBe('ls projects/');

      // After full pause + some delete time, text should be shorter
      vi.advanceTimersByTime(800 + 100);
      expect(twEl.textContent.length).toBeLessThan(12);
    });
  });

  describe('initRevealAnimations', () => {
    let intersectionObserverMock;
    let observeSpy;
    let unobserveSpy;

    beforeEach(() => {
      intersectionObserverMock = vi.fn();
      observeSpy = vi.fn();
      unobserveSpy = vi.fn();
      
      intersectionObserverMock.mockImplementation((callback, options) => ({
        observe: observeSpy,
        unobserve: unobserveSpy,
        disconnect: vi.fn()
      }));
      
      global.IntersectionObserver = intersectionObserverMock;
    });

    it('should observe all elements with .reveal class', () => {
      for (let i = 0; i < 5; i++) {
        const el = document.createElement('div');
        el.classList.add('reveal');
        document.body.appendChild(el);
      }

      initRevealAnimations();

      expect(observeSpy).toHaveBeenCalledTimes(5);
    });

    it('should make elements visible immediately when reduced motion is preferred', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      const el = document.createElement('div');
      el.classList.add('reveal');
      document.body.appendChild(el);

      initRevealAnimations();

      expect(el.classList.contains('visible')).toBe(true);
      expect(observeSpy).not.toHaveBeenCalled();
    });

    it('should add visible class when element enters viewport', () => {
      let observerCallback;
      intersectionObserverMock.mockImplementation((callback) => {
        observerCallback = callback;
        return {
          observe: observeSpy,
          unobserve: unobserveSpy,
          disconnect: vi.fn()
        };
      });

      const el = document.createElement('div');
      el.classList.add('reveal');
      document.body.appendChild(el);

      initRevealAnimations();

      // Simulate element entering viewport
      observerCallback([{ 
        isIntersecting: true, 
        target: el 
      }]);

      expect(el.classList.contains('visible')).toBe(true);
    });

    it('should unobserve element after it becomes visible', () => {
      let observerCallback;
      intersectionObserverMock.mockImplementation((callback) => {
        observerCallback = callback;
        return {
          observe: observeSpy,
          unobserve: unobserveSpy,
          disconnect: vi.fn()
        };
      });

      const el = document.createElement('div');
      el.classList.add('reveal');
      document.body.appendChild(el);

      initRevealAnimations();

      observerCallback([{ 
        isIntersecting: true, 
        target: el 
      }]);

      expect(unobserveSpy).toHaveBeenCalledWith(el);
    });

    it('should use threshold of 0.1 for intersection', () => {
      // Ensure reduced motion is not preferred
      matchMediaMock.mockImplementation((query) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
        }
        return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
      });

      // Add reveal elements so initRevealAnimations proceeds
      const el = document.createElement('div');
      el.classList.add('reveal');
      document.body.appendChild(el);

      initRevealAnimations();

      expect(intersectionObserverMock).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.1 }
      );
    });

    it('should not throw if no reveal elements exist', () => {
      expect(() => initRevealAnimations()).not.toThrow();
    });
  });

  describe('initAnimations', () => {
    it('should initialize all animation components', () => {
      // Set up matchMedia mock
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }));
      
      // Create required elements
      const glowEl = document.createElement('div');
      glowEl.id = 'cursor-glow';
      document.body.appendChild(glowEl);

      const twEl = document.createElement('span');
      twEl.id = 'tw';
      document.body.appendChild(twEl);

      // Mock IntersectionObserver
      global.IntersectionObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      }));

      // Should not throw
      expect(() => initAnimations()).not.toThrow();
    });
  });
});