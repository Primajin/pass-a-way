import test from 'ava';

import {addUrl, chooseBestFontSize, generateImage} from '../src/lib/index.js';

test('addUrl', t => {
	const mockContext = {
		fillStyle: '',
		font: '',
		textAlign: '',
		textBaseline: '',
		fillText() {},
	};

	addUrl(mockContext, [400, 150]);

	t.is(mockContext.fillStyle, '#000');
	t.is(mockContext.font, 'bold 30pt Sans');
	t.is(mockContext.textAlign, 'center');
	t.is(mockContext.textBaseline, 'bottom');
});

test('chooseBestFontSize', t => {
	const mockContext = {
		font: '',
		measureText: () => ({width: 500}),
		canvas: {width: 1000},
	};

	chooseBestFontSize('test', mockContext);

	t.is(mockContext.font, 'bold 70px monospace');
});

test('chooseBestFontSize with smaller font', t => {
	const mockContext = {
		font: '',
		measureText: () => ({width: 1200}),
		canvas: {width: 1000},
	};

	chooseBestFontSize('test', mockContext);

	t.is(mockContext.font, 'bold 31px monospace');
});

test('generateImage', t => {
	const mockContext = {
		font: '',
		measureText: () => ({width: 500}),
		canvas: {width: 800, height: 300},
		textAlign: '',
		textBaseline: '',
		fillStyle: '',
		fillText() {},
		getImageData: () => ({data: [0, 0, 0, 0]}),
		fillRect() {},
		clearRect() {},
	};
	const createCanvas = () => ({
		getContext: () => mockContext,
	});
	const randomInt = () => 0;

	const result = generateImage(createCanvas, randomInt, 'test');

	t.is(result.images.length, 2);
	t.deepEqual(result.middlePoint, [400, 150]);
	t.truthy(result.temporaryImage);
});

test('generateImage with empty pixel and non-zero random', t => {
	const mockContext = {
		font: '',
		measureText: () => ({width: 500}),
		canvas: {width: 800, height: 300},
		textAlign: '',
		textBaseline: '',
		fillStyle: '',
		fillText() {},
		getImageData: () => ({data: [0, 0, 0, 0]}),
		fillRect() {},
		clearRect() {},
	};
	const createCanvas = () => ({
		getContext: () => mockContext,
	});
	const randomInt = () => 1;

	const result = generateImage(createCanvas, randomInt, 'test');

	t.is(result.images.length, 2);
	t.deepEqual(result.middlePoint, [400, 150]);
	t.truthy(result.temporaryImage);
});

test('generateImage with non-empty pixel', t => {
	const mockContext = {
		font: '',
		measureText: () => ({width: 500}),
		canvas: {width: 800, height: 300},
		textAlign: '',
		textBaseline: '',
		fillStyle: '',
		fillText() {},
		getImageData: () => ({data: [1, 1, 1, 1]}),
		fillRect() {},
		clearRect() {},
	};
	const createCanvas = () => ({
		getContext: () => mockContext,
	});
	const randomInt = () => 1;

	const result = generateImage(createCanvas, randomInt, 'test');

	t.is(result.images.length, 2);
	t.deepEqual(result.middlePoint, [400, 150]);
	t.truthy(result.temporaryImage);
});
