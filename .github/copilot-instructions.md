# Copilot Instructions

## Setup

Always install npm dependencies before making changes:

```bash
npm ci
```

## Code Style

This project uses [XO](https://github.com/xojs/xo) for linting. Keep the code clean and tidy by running the linter:

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
```

## Testing

Run tests with:

```bash
npm run test
```

## Code Coverage

Run tests with coverage:

```bash
npm run coverage
```

When adding new code, ensure that test coverage does not decrease. Add appropriate tests for any new functionality.
