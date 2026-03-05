# Running Tests

This project uses [Vitest](https://vitest.dev/) for unit testing.

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `tests/setup.js` - Test setup and mocks
- `tests/utils.test.js` - Tests for utility functions (fuzzy search, debounce, throttle, etc.)
- `tests/data.test.js` - Tests for data structure and action resolution
- `tests/theme.test.js` - Tests for theme system (light/dark mode)
- `tests/animations.test.js` - Tests for animation functionality
- `tests/app.test.js` - Tests for main application logic

## Coverage

Coverage reports are generated in the `coverage/` directory after running:

```bash
npm run test:coverage
```

## Writing New Tests

Tests are organized by module. Each test file corresponds to a JavaScript module in the `js/` directory:

- Use `describe` blocks to group related tests
- Use `it` or `test` for individual test cases
- Use `vi.fn()` for mocks
- Use `beforeEach` and `afterEach` for setup and cleanup