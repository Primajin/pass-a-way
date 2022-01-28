import fs from 'node:fs';
import canvasPKG from 'canvas';

const {createCanvas} = canvasPKG;

const IMAGE_SIZE = [800, 300]; // Image size
const GENERATE_IMAGE_COUNT = 2; // How many images you would like to generate (2-10)

const [width, height] = IMAGE_SIZE;
const middlePoint = [width / 2, height / 2];

const temporaryImage = createCanvas(width, height);
const temporaryImageContext = temporaryImage.getContext('2d');

/**
 * Generates random number between min and max (inclusive)
 * @param {number} [max=255] - Max value
 * @param {number} [min=0] - Min value
 * @returns {number}
 */
const getRandomIntInclusive = (max = 255, min = 0) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor((Math.random() * (max - min + 1)) + min); // The maximum is inclusive and the minimum is inclusive
};

const text = 'Hello, World!';
temporaryImageContext.font = 'bold 70pt Sans';
temporaryImageContext.textAlign = 'center';
temporaryImageContext.textBaseline = 'middle';
temporaryImageContext.fillStyle = '#000';
temporaryImageContext.fillText(text, middlePoint[0], middlePoint[1]);

const images = [];
for (let i = 0; i < GENERATE_IMAGE_COUNT; i++) {
	images[i] = createCanvas(width, height);
}

// We need to generate a random number for each pixel
// the number should be between 0 and the number of images we want to generate - 1
// the crypto buffer gives us random hexadecimal numbers
// we just need to convert them to the radix of the number of images
// a radix of 2 will give us a binary number with four digits
// a radix of 3 will give us a ternary number with three digits
// a radix of up to 10 will give us a decimal number with always two digits
// we can divide the overall amount of needed randoms by the number of digits we get to save some time

// const divider = images.length === 2 ? 4 : (images.length === 3 ? 3 : 2);
//
// const {randomBytes} = await import('node:crypto');
// randomBytes(((width * height) / divider), (error, buffer) => {
// 	if (error) {
// 		throw error;
// 	}
//
// 	console.log(`${buffer.length} bytes of random data: ${buffer.toString('hex')}`);
// 	const bufferString = buffer.toString('hex');
//
// 	console.log('bufferString.length', width * height, bufferString.length, bufferString.length / (width * height));
// 	console.log(0xF.toString(images.length));
// });

for (let x = 0; x < width; x++) {
	for (let y = 0; y < height; y++) {
		const index = getRandomIntInclusive(images.length - 1); // TODO: get random number from crypto
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

fs.writeFileSync('./dist/tempImage.png', temporaryImage.toBuffer());
for (const [i, image] of images.entries()) {
	const imageContext = image.getContext('2d');
	imageContext.fillStyle = '#000';
	imageContext.font = 'bold 30pt Sans';
	imageContext.textAlign = 'center';
	imageContext.textBaseline = 'bottom';
	imageContext.fillText('pass-a-way.net', middlePoint[0], height - 10);

	fs.writeFileSync('./dist/image' + i + '.png', image.toBuffer());
}
