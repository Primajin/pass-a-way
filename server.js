import fs from 'node:fs';
import canvasPKG from 'canvas';

const {createCanvas} = canvasPKG;

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

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.fillRect(0, 0, width, height);

for (let i = 500; i--;) {
	context.fillStyle = 'rgba(' + getRandomIntInclusive() + ',' + getRandomIntInclusive() + ',' + getRandomIntInclusive() + ',' + (getRandomIntInclusive(255, 150) / 255) + ')';
	context.fillRect(getRandomIntInclusive(width), getRandomIntInclusive(height), 1, 1);
}

context.font = 'bold 70pt Sans';
context.textAlign = 'center';
context.textBaseline = 'top';
context.fillStyle = '#3574d4';

const text = 'Hello, World!';

const textWidth = context.measureText(text).width;
context.fillRect(600 - (textWidth / 2) - 10, 170 - 5, textWidth + 20, 120);
context.fillStyle = '#fff';
context.fillText(text, 600, 170);

context.fillStyle = '#fff';
context.font = 'bold 30pt Sans';
context.fillText('pass-a-way.net', 600, 530);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./dist/test.png', buffer);

const {randomBytes} = await import('node:crypto');
randomBytes(256, (error, buffer) => {
	if (error) {
		throw error;
	}

	console.log(`${buffer.length} bytes of random data: ${buffer.toString('hex')}`);
});
