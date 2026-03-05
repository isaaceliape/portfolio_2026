/**
 * Test setup file - runs before each test
 */

import { vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  })
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock DOM methods not available in jsdom
if (!global.Element.prototype.scrollIntoView) {
  global.Element.prototype.scrollIntoView = vi.fn();
}

if (!global.Element.prototype.closest) {
  global.Element.prototype.closest = vi.fn(function(selector) {
    if (this.matches(selector)) return this;
    let el = this.parentElement;
    while (el) {
      if (el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  });
}

// Create a reusable matchMedia mock function
export const createMatchMediaMock = (defaultMatches = false) =>
  vi.fn((query) => ({
    matches: defaultMatches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));

// Set up global matchMedia mock (default to false)
window.matchMedia = createMatchMediaMock(false);
global.matchMedia = createMatchMediaMock(false);

// Clean up before each test
beforeEach(() => {
  // Reset document state
  document.body.innerHTML = '';
  document.documentElement.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
  
  // Clear localStorage mock
  localStorageMock.clear();
  
  // Clear all mocks
  vi.clearAllMocks();
});
