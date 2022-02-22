/* eslint max-depth: ["error", 5] */
import fs from 'node:fs';
import {randomInt} from 'node:crypto';
import canvasPKG from 'canvas';

import {generateImage, addUrl} from '../lib/index.js';

const {createCanvas} = canvasPKG;

const text = 'Hello, World!';
const {images, middlePoint, temporaryImage} = generateImage(createCanvas, randomInt, text);

// Clean up
const path = './dist/';
const regex = /\.png$/;
fs.readdirSync(path).filter(f => regex.test(f)).map(f => fs.unlinkSync(path + f));

// Save temp image - for debugging purposes - REMOVE IN PRODUCTION
fs.writeFileSync(path + 'tempImage.png', temporaryImage.toBuffer());

// Save images
for (const [i, image] of images.entries()) {
	const imageContext = image.getContext('2d');
	addUrl(imageContext, middlePoint);
	fs.writeFileSync(path + 'image' + i + '.png', image.toBuffer());
}
