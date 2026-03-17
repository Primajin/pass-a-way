# Copilot Instructions

## Project Overview

**Pass-a-way** is a steganographic password-preservation tool. It encodes a secret text into two visual images by distributing each pixel randomly between them — neither image alone reveals the secret; overlaying both reconstructs the original text. There is a browser UI (`index.html`) and a Node.js CLI that both use the shared core library in `src/lib/`.

## Architecture

```
src/
├── lib/index.js       # Shared core logic (generateImage, chooseBestFontSize, addUrl)
├── browser/index.js   # Browser entry-point — DOM event wiring, canvas creation
└── node/index.js      # Node.js CLI — file I/O, uses `canvas` npm package

test/
├── lib.test.js        # Unit tests for core library
├── browser.test.js    # Integration tests using jsdom
├── node.test.js       # Integration tests for Node.js output files
└── noop.js            # AVA helper

scripts/
└── build.js           # ESBuild wrapper (accepts --minify, --watch, --sourcemap)

index.html             # Frontend UI
dist/                  # Build output (do NOT commit generated files)
```

### Key design patterns

- **Dependency injection for testability**: `generateImage(createCanvas, randomInt, text)` accepts factory functions rather than calling platform APIs directly, so tests can supply pure mocks without touching the DOM or `canvas` package.
- **ES modules throughout**: The project uses `"type": "module"` — always use `import`/`export`, never `require`.
- **Separate browser and Node.js entry-points** that both import from `src/lib/index.js`.

## Tech Stack

| Area | Tool |
|---|---|
| Runtime | Node.js ^24 |
| Language | JavaScript (ES modules) |
| Linter | [XO](https://github.com/xojs/xo) (opinionated ESLint wrapper) |
| Test runner | [AVA](https://github.com/avajs/ava) |
| Coverage | [c8](https://github.com/bcoe/c8) |
| Browser bundler | [esbuild](https://esbuild.github.io/) |
| Node.js bundler | [@vercel/ncc](https://github.com/vercel/ncc) |
| DOM emulation | [jsdom](https://github.com/jsdom/jsdom) |
| Image rendering | [canvas](https://github.com/Automattic/node-canvas) (native addon) |

## Setup

### Prerequisites — native dependencies for `canvas`

The `canvas` package is a native Node.js addon that requires system libraries. Install them before running `npm ci`:

**Ubuntu / Debian**
```bash
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**macOS**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman python-setuptools
```

**Windows** (via Chocolatey)
```bash
choco install -y python3 gtk-runtime microsoft-build-tools libjpeg-turbo
```

### Install dependencies

```bash
npm ci
```

## Development Workflow

```bash
# Watch-mode browser bundle (with source maps)
npm run dev:browser

# Watch-mode Node.js (restarts on file change)
npm run dev:node

# Watch-mode linting with auto-fix
npm run lint:watch

# Watch-mode tests
npm run test:watch
```

## Code Style

This project uses [XO](https://github.com/xojs/xo) for linting. XO enforces strict rules including tabs for indentation, single quotes, and unicorn/import ordering rules.

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Import ordering (enforced by XO)

Imports must be grouped with a blank line between each group:

1. Built-in Node.js modules (`node:fs`, `node:crypto`, …)
2. External npm packages
3. Internal (`../`, `./`) imports

```js
import fs from 'node:fs';
import {randomInt} from 'node:crypto';

import canvasPKG from 'canvas';

import {generateImage} from '../lib/index.js';
```

### Other conventions

- Tabs (not spaces) for indentation — XO enforces this automatically.
- Semicolons are not enforced, but follow the existing file style.
- `/* global document */` comment required at the top of browser files that rely on globals.
- Inline ESLint disable comments (`/* eslint max-depth: ["error", 5] */`) are acceptable for files with legitimately deep loops.
- Always link a GitHub issue when leaving a `// TODO:` comment.

## Testing

```bash
# Run all tests once
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage report (LCOV output)
npm run coverage
```

Test coverage must not decrease when adding new code. Always add tests for new functionality.

### Writing tests — AVA conventions

- One `test/` file per source file (`lib.test.js`, `browser.test.js`, `node.test.js`).
- Import from `ava` as the default export: `import test from 'ava';`
- Use descriptive test titles that state *what* is being tested and the expected outcome.
- Prefer simple, focused assertions (`t.is`, `t.deepEqual`, `t.truthy`).

### Mocking patterns

The library functions accept dependencies as arguments, so mocks are pure objects:

```js
const mockContext = {
  font: '',
  measureText: () => ({width: 500}),
  canvas: {width: 800, height: 300},
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
  fillText: () => undefined,
  getImageData: () => ({data: [0, 0, 0, 0]}),
  fillRect: () => undefined,
  clearRect: () => undefined,
};

const createCanvas = () => ({getContext: () => mockContext});
const randomInt = () => 0; // deterministic
```

### Browser tests (jsdom)

The browser entry-point attaches listeners on `DOMContentLoaded`. Set up the DOM environment *before* importing the module, then dispatch the event manually:

```js
test.beforeEach(async () => {
  const dom = new JSDOM('<!DOCTYPE html>…');
  globalThis.document = dom.window.document;
  globalThis.window = dom.window;
  await import('../src/browser/index.js');
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
});

test.afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.createImages;
});
```

## Build

```bash
# Build both browser bundle and Node.js server bundle
npm run build

# Browser only (minified, outputs to dist/)
npm run build:browser

# Node.js server only (bundled with ncc, outputs to dist/server/)
npm run build:server
```

The `dist/` directory is generated output — never commit files from it.

## CI / CD

| Workflow | Trigger | What it does |
|---|---|---|
| `build.yml` | every push | Builds on Ubuntu, macOS, Windows |
| `test.yml` | push / PR to `main` | Runs coverage and uploads to Codecov |
| `lint.yml` | push / PR | Runs XO linter |
| `codeql-analysis.yml` | push / PR to `main` | CodeQL security scan |

Dependabot is configured to open daily PRs for npm and GitHub Actions updates.

## Pull Requests

- Keep changes focused and minimal; one concern per PR.
- Ensure `npm run lint` and `npm run test` pass locally before pushing.
- Do not decrease code coverage — add tests alongside new features.
- The PR title should be short and descriptive (imperative mood preferred, e.g. *"Add support for 3-image split"*).
- Link the relevant GitHub issue in the PR description.

