#!/usr/bin/env node
/* eslint max-depth: ["error", 5] */
import fs from 'node:fs';
import process from 'node:process';
import {randomInt} from 'node:crypto';
import canvasPKG from 'canvas';

import {generateImage, addUrl} from '../lib/index.js';

const {createCanvas} = canvasPKG;

const printHelp = () => {
	console.log(`Usage: node src/node/index.js [options]

Options:
  -n, --number <count>  Number of images to split the password into (min 2, default 2)
  -d, --debug           Save a temporary debug image showing the original rendered text
  -u, --no-url          Do not add the pass-a-way.net URL to the generated images
  -h, --help            Show this help message`);
};

const args = process.argv.slice(2);
let imageCount = 2;
let debug = false;
let showUrl = true;

for (let i = 0; i < args.length; i++) {
	switch (args[i]) {
		case '-h':
		case '--help': {
			printHelp();
			process.exit(0);
			break;
		}

		case '-d':
		case '--debug': {
			debug = true;
			break;
		}

		case '-u':
		case '--no-url': {
			showUrl = false;
			break;
		}

		case '-n':
		case '--number': {
			const value = Number(args[i + 1]);
			if (!Number.isInteger(value) || value < 2) {
				console.error('Error: --number requires an integer value of at least 2');
				process.exit(1);
			}

			imageCount = value;
			i++;
			break;
		}

		default: {
			console.error(`Unknown option: ${args[i]}`);
			printHelp();
			process.exit(1);
		}
	}
}

const text = 'Hello, World!';
const {images, middlePoint, temporaryImage} = generateImage(createCanvas, randomInt, text, imageCount);

// Clean up
const path = './dist/';
const regex = /\.png$/v;
fs.readdirSync(path).filter(f => regex.test(f)).map(f => fs.unlinkSync(path + f));

// Save temp image only in debug mode
if (debug) {
	fs.writeFileSync(path + 'tempImage.png', temporaryImage.toBuffer());
}

// Save images
for (const [i, image] of images.entries()) {
	const imageContext = image.getContext('2d');
	if (showUrl) {
		addUrl(imageContext, middlePoint);
	}

	fs.writeFileSync(path + 'image' + i + '.png', image.toBuffer());
}
