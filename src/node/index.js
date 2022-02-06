/* eslint max-depth: ["error", 5] */
import fs from 'node:fs';
import {randomInt} from 'node:crypto';
import canvasPKG from 'canvas';

const {createCanvas} = canvasPKG;

const IMAGE_SIZE = [800, 300]; // Image size
const GENERATE_IMAGE_COUNT = 2; // How many images you would like to generate (2-10)

const [width, height] = IMAGE_SIZE;
const middlePoint = [width / 2, height / 2];

const temporaryImage = createCanvas(width, height);
const temporaryImageContext = temporaryImage.getContext('2d');

const text = 'Hello, World!';
// eslint-disable-next-line no-warning-comments
temporaryImageContext.font = 'bold 70pt monospace'; // TODO: calculate max font size based on text length
temporaryImageContext.textAlign = 'center';
temporaryImageContext.textBaseline = 'middle';
temporaryImageContext.fillStyle = '#000';
temporaryImageContext.fillText(text, middlePoint[0], middlePoint[1]);

const images = [];
for (let i = 0; i < GENERATE_IMAGE_COUNT; i++) {
	images[i] = createCanvas(width, height);
}

for (let x = 0; x < width; x++) {
	for (let y = 0; y < height; y++) {
		const index = randomInt(images.length);
		const pixelData = temporaryImageContext.getImageData(x, y, 1, 1).data;

		if (pixelData[3] === 0) { // Check if the color is empty
			for (const image of images) {
				const imageContext = image.getContext('2d');
				if (index === 0) {
					imageContext.fillRect(x, y, 1, 1);
					imageContext.clearRect(x + 1, y, 1, 1);
				} else {
					imageContext.clearRect(x, y, 1, 1);
					imageContext.fillRect(x + 1, y, 1, 1);
				}
			}
		} else {
			for (let i = 0; i < images.length; i++) {
				const imageContext = images[i].getContext('2d');
				if ((index + i) % images.length === 0) {
					imageContext.fillRect(x, y, 1, 1);
					imageContext.clearRect(x + 1, y, 1, 1);
				} else {
					imageContext.clearRect(x, y, 1, 1);
					imageContext.fillRect(x + 1, y, 1, 1);
				}
			}
		}
	}
}

// Clean up
const path = './dist/';
const regex = /\.png$/;
fs.readdirSync(path).filter(f => regex.test(f)).map(f => fs.unlinkSync(path + f));

// Save temp image - for debugging purposes - REMOVE IN PRODUCTION
fs.writeFileSync(path + 'tempImage.png', temporaryImage.toBuffer());

// Save images
for (const [i, image] of images.entries()) {
	const imageContext = image.getContext('2d');
	imageContext.fillStyle = '#000';
	imageContext.font = 'bold 30pt Sans';
	imageContext.textAlign = 'center';
	imageContext.textBaseline = 'bottom';
	imageContext.fillText('pass-a-way.net', middlePoint[0], height - 10);

	fs.writeFileSync(path + 'image' + i + '.png', image.toBuffer());
}
