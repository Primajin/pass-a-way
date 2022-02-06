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

const temporaryImage = generateImage(createCanvas);

document.body.append(temporaryImage);
