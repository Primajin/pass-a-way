import test from 'ava';
import {JSDOM} from 'jsdom';

// Note: '../src/browser/index.js' is NOT imported at the top level.

// All tests in this file share state via globalThis.document/window/createImages, set up
// in the hooks below. AVA runs tests within a file concurrently by default; combined with
// Node's ES module cache (a plain '../src/browser/index.js' specifier only ever evaluates
// once per process, so only the FIRST import call would actually attach the
// DOMContentLoaded listener), concurrent execution here previously produced test bodies
// that all silently observed whichever single document happened to "win" the race, rather
// than each test's own DOM. Two things fix that: `test.serial` makes hook/body execution
// deterministic, and a cache-busting query string on the dynamic import forces a fresh
// module evaluation (and therefore a fresh listener bound to that test's own document) per
// test.

test.serial.beforeEach(async () => {
	const dom = new JSDOM('<!DOCTYPE html><html><body><div id="browser"><div class="wrapper"></div><input value="test"></div></body></html>');
	// eslint-disable-next-line unicorn/no-global-object-property-assignment -- jsdom test environment requires patching globalThis
	globalThis.document = dom.window.document;
	// eslint-disable-next-line unicorn/no-global-object-property-assignment -- jsdom test environment requires patching globalThis
	globalThis.window = dom.window;

	// Dynamically import the browser script AFTER the DOM environment is set up. The
	// cache-busting query string forces Node to re-evaluate the module for every test, so
	// the DOMContentLoaded listener below is attached to THIS test's own document.
	await import(`../src/browser/index.js?test=${Date.now()}-${Math.random()}`);

	// The script adds an event listener for DOMContentLoaded. We need to trigger it.
	const event = new dom.window.Event('DOMContentLoaded');
	dom.window.document.dispatchEvent(event);
});

test.serial.afterEach(() => {
	// Clean up globals to avoid polluting other tests
	delete globalThis.window;
	delete globalThis.document;
	delete globalThis.createImages;
});

test.serial('createImages is defined', t => {
	t.truthy(globalThis.createImages);
});

test.serial('createImages creates images without temporaryImage', t => {
	globalThis.createImages();
	const images = globalThis.document.querySelectorAll('canvas');
	// 2 images + 2 clones = 4 (temporaryImage is not rendered by default)
	t.is(images.length, 4);
});

test.serial('createImages clears previous images on re-render', t => {
	globalThis.createImages();
	t.is(globalThis.document.querySelectorAll('canvas').length, 4);

	// Call again to trigger the while loop that removes existing children
	globalThis.createImages();
	const images = globalThis.document.querySelectorAll('canvas');
	// Should still be 4, not 8 — old ones were removed
	t.is(images.length, 4);
});

test.serial('createImages renders nothing when input is empty', t => {
	globalThis.document.querySelector('#browser input').value = '';
	globalThis.createImages();
	t.is(globalThis.document.querySelectorAll('canvas').length, 0);
});

test.serial('createImages renders nothing when input exceeds 45 characters', t => {
	globalThis.document.querySelector('#browser input').value = 'a'.repeat(46);
	globalThis.createImages();
	t.is(globalThis.document.querySelectorAll('canvas').length, 0);
});

test.serial('createImages clears previously rendered images when input becomes invalid', t => {
	globalThis.createImages();
	t.is(globalThis.document.querySelectorAll('canvas').length, 4);

	globalThis.document.querySelector('#browser input').value = '';
	globalThis.createImages();
	t.is(globalThis.document.querySelectorAll('canvas').length, 0);
});
