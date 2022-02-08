/* global document */
import {generateImage} from '../lib/index.js';

const newDiv = document.createElement('div');
newDiv.innerHTML = 'Hello World';
document.body.append(newDiv);

const createCanvas = (width, height) => {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

const randomInt = max => Math.floor(Math.random() * max);
const text = 'Hello, World!';
const {images, temporaryImage} = generateImage(createCanvas, randomInt, text);

for (const image of images) {
	const imageContext = image.getContext('2d');
	imageContext.fillStyle = '#000';
	imageContext.font = 'bold 30pt Sans';
	imageContext.textAlign = 'center';
	imageContext.textBaseline = 'bottom';
	imageContext.fillText('pass-a-way.net', 400, 300 - 10);

	document.body.append(image);
}

document.body.append(temporaryImage);

const cloneCanvas = oldCanvas => {
	const newCanvas = document.createElement('canvas');
	const context = newCanvas.getContext('2d');
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;
	context.drawImage(oldCanvas, 0, 0);
	return newCanvas;
};

const elementDiv = document.createElement('div');
elementDiv.classList.add('holder', 'browser');
document.body.append(elementDiv);
for (const image of images) {
	document.querySelector('.browser').append(cloneCanvas(image));
}
