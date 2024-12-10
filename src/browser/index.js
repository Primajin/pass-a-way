/* global document */
import {generateImage, addUrl} from '../lib/index.js';

document.addEventListener('DOMContentLoaded', () => {
	const browserElement = document.querySelector('#browser .wrapper');
	const inputElement = document.querySelector('#browser input');

	const createCanvas = (width, height) => {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas;
	};

	const randomInt = max => Math.floor(Math.random() * max);

	const createImages = () => {
		while (browserElement.firstChild) {
			browserElement.firstChild.remove();
		}

		const text = inputElement.value;
		if (text && text.length <= 45) {
			const {images, middlePoint, temporaryImage} = generateImage(createCanvas,
				randomInt, text);

			for (const image of images) {
				const imageContext = image.getContext('2d');
				addUrl(imageContext, middlePoint);
				browserElement.append(image);
			}

			browserElement.append(temporaryImage);

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
			browserElement.append(elementDiv);
			for (const image of images) {
				document.querySelector('.browser').append(cloneCanvas(image));
			}
		}
	};

	globalThis.createImages = createImages;
});
