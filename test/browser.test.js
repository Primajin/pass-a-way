import test from 'ava';
import {JSDOM} from 'jsdom';

// Note: '../src/browser/index.js' is NOT imported at the top level.

test.beforeEach(async t => {
	const dom = new JSDOM('<!DOCTYPE html><html><body><div id="browser"><div class="wrapper"></div><input value="test"></div></body></html>');
	global.document = dom.window.document;
	global.window = dom.window;

	// Dynamically import the browser script AFTER the DOM environment is set up.
	await import('../src/browser/index.js');

	// The script adds an event listener for DOMContentLoaded. We need to trigger it.
	const event = new dom.window.Event('DOMContentLoaded');
	dom.window.document.dispatchEvent(event);
});

test.afterEach(t => {
    // Clean up globals to avoid polluting other tests
    delete global.window;
    delete global.document;
    delete global.createImages;
});

test('createImages is defined', t => {
	t.truthy(global.createImages);
});

test('createImages creates images', t => {
	global.createImages();
	const images = global.document.querySelectorAll('canvas');
	// 2 images + temporaryImage + 2 clones = 5
	t.is(images.length, 5);
});
