/**
 * Tests for utils.js - Utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fuzzy, highlight, esc, debounce, throttle } from '../js/utils.js';

describe('utils', () => {
  describe('fuzzy', () => {
    it('should return null when pattern does not match string', () => {
      expect(fuzzy('hello world', 'xyz')).toBeNull();
      expect(fuzzy('javascript', 'python')).toBeNull();
    });

    it('should return match when pattern matches string', () => {
      const result = fuzzy('hello world', 'hw');
      expect(result).not.toBeNull();
      expect(result.score).toBe(2);
      expect(result.indices).toEqual([0, 6]);
    });

    it('should handle case-insensitive matching', () => {
      const result = fuzzy('Hello World', 'hw');
      expect(result).not.toBeNull();
      expect(result.indices).toEqual([0, 6]);
    });

    it('should handle consecutive characters', () => {
      const result = fuzzy('javascript', 'java');
      expect(result).not.toBeNull();
      expect(result.score).toBe(4);
      expect(result.indices).toEqual([0, 1, 2, 3]);
    });

    it('should handle non-consecutive characters', () => {
      const result = fuzzy('javascript', 'jvt');
      expect(result).not.toBeNull();
      expect(result.score).toBe(3);
      // j=0, v=2, t=9 in "javascript"
      expect(result.indices).toEqual([0, 2, 9]);
    });

    it('should return null when pattern is longer than string', () => {
      expect(fuzzy('hi', 'hello')).toBeNull();
    });

    it('should handle empty pattern', () => {
      const result = fuzzy('hello', '');
      expect(result.score).toBe(0);
      expect(result.indices).toEqual([]);
    });

    it('should handle empty string', () => {
      const result = fuzzy('', 'test');
      expect(result).toBeNull();
    });
  });

  describe('highlight', () => {
    it('should escape text when no indices provided', () => {
      expect(highlight('hello world', [])).toBe('hello world');
      expect(highlight('hello world', null)).toBe('hello world');
      expect(highlight('hello world', undefined)).toBe('hello world');
    });

    it('should highlight characters at specified indices', () => {
      expect(highlight('hello', [0, 2, 4])).toBe('<mark>h</mark>e<mark>l</mark>l<mark>o</mark>');
    });

    it('should escape HTML special characters', () => {
      expect(highlight('<script>', [0])).toBe('<mark>&lt;</mark>script&gt;');
      expect(highlight('hello & goodbye', [6])).toBe('hello <mark>&amp;</mark> goodbye');
    });

    it('should handle consecutive indices', () => {
      expect(highlight('javascript', [0, 1, 2, 3]))
        .toBe('<mark>j</mark><mark>a</mark><mark>v</mark><mark>a</mark>script');
    });
  });

  describe('esc', () => {
    it('should escape HTML special characters', () => {
      expect(esc('<div>')).toBe('&lt;div&gt;');
      expect(esc('hello & world')).toBe('hello &amp; world');
    });

    it('should escape multiple special characters', () => {
      expect(esc('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    it('should return empty string for empty input', () => {
      expect(esc('')).toBe('');
    });

    it('should not modify strings without special characters', () => {
      expect(esc('hello world')).toBe('hello world');
    });

    it('should handle already escaped strings', () => {
      expect(esc('&lt;')).toBe('&amp;lt;');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);
      
      debounced();
      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the function', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should maintain correct this context', () => {
      const fn = vi.fn(function() { return this; });
      const debounced = debounce(fn, 100);
      const obj = { method: debounced };

      obj.method();
      vi.advanceTimersByTime(100);

      expect(fn.mock.results[0].value).toBe(obj);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should execute function immediately on first call', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should ignore calls during throttle period', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow execution after throttle period', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      vi.advanceTimersByTime(100);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to the function', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled('arg1', 'arg2');

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should maintain correct this context', () => {
      const fn = vi.fn(function() { return this; });
      const throttled = throttle(fn, 100);
      const obj = { method: throttled };

      obj.method();

      expect(fn.mock.results[0].value).toBe(obj);
    });
  });
});