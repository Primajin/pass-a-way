# Pass·a·way

> A way to pass away a password before you pass away.

**Pass-a-way** is a steganographic password-preservation tool. It encodes a secret text into two visual images by distributing each pixel randomly between them. Neither image alone reveals the secret — overlaying both reconstructs the original text.

## How it works

1. Type your secret text into the browser UI or run the Node.js CLI.
2. The tool renders the text onto a temporary canvas, then walks every pixel.
3. Each pixel is randomly assigned to one of two output images. Empty background pixels get a decoy pattern; text pixels are split so the correct pixel lands in exactly one image.
4. Download or print both images. To recover the secret, overlay them — the pixels re-combine to reveal the original text.

## Usage

### Browser

Open `index.html` in a browser after building the bundle:

```bash
npm run build:browser
```

Type your secret (up to 45 characters) into the **Secret** field. Two steganographic images appear instantly in the page, along with an overlay preview showing the decoded result.

### Node.js CLI

```bash
npm run build:server
node dist/server/index.js
```

Or run directly from source (requires the native `canvas` prerequisites below):

```bash
node src/node/index.js
```

Output images are written to `dist/`:

| File | Purpose |
|---|---|
| `dist/image0.png` | First steganographic share |
| `dist/image1.png` | Second steganographic share |
| `dist/tempImage.png` | Debug image showing the original rendered text |

## Installation

### Prerequisites — native dependencies for `canvas`

The `canvas` package is a native Node.js addon. Install the required system libraries **before** running `npm ci`.

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

Requires **Node.js ^24**.

```bash
npm ci
```

## Development

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

## Building

```bash
# Build both browser and Node.js bundles
npm run build

# Browser only (minified, outputs to dist/)
npm run build:browser

# Node.js server only (bundled with ncc, outputs to dist/server/)
npm run build:server
```

The `dist/` directory is generated output — do not commit files from it.

## Testing & linting

```bash
npm run test        # Run all tests
npm run coverage    # Run tests with LCOV coverage report
npm run lint        # Check code style (XO / ESLint)
npm run lint:fix    # Auto-fix lint issues
```

## Architecture

```
src/
├── lib/index.js       # Shared core logic (generateImage, chooseBestFontSize, addUrl)
├── browser/index.js   # Browser entry-point — DOM event wiring, canvas creation
└── node/index.js      # Node.js CLI — file I/O, uses `canvas` npm package

test/
├── lib.test.js        # Unit tests for core library
├── browser.test.js    # Integration tests using jsdom
└── node.test.js       # Integration tests for Node.js output files

scripts/
└── build.js           # ESBuild wrapper

index.html             # Frontend UI
dist/                  # Build output (generated — do not commit)
```

## Tech stack

| Area | Tool |
|---|---|
| Runtime | Node.js ^24 |
| Language | JavaScript (ES modules) |
| Linter | [XO](https://github.com/xojs/xo) |
| Test runner | [AVA](https://github.com/avajs/ava) |
| Coverage | [c8](https://github.com/bcoe/c8) |
| Browser bundler | [esbuild](https://esbuild.github.io/) |
| Node.js bundler | [@vercel/ncc](https://github.com/vercel/ncc) |
| DOM emulation | [jsdom](https://github.com/jsdom/jsdom) |
| Image rendering | [canvas](https://github.com/Automattic/node-canvas) |

## License

ISC © [Jannis Hell](https://github.com/Primajin)
