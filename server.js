import fs from 'node:fs';
import canvasPKG from 'canvas';

const {createCanvas} = canvasPKG;

const getRandomInt = max => Math.floor(Math.random() * max);

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.fillRect(0, 0, width, height);

for (let i = 500; i--;) {
	context.fillStyle = 'rgba(' + getRandomInt(256) + ',' + getRandomInt(256) + ',' + getRandomInt(256) + ',' + (getRandomInt(256) / 255) + ')';
	context.fillRect(getRandomInt(width), getRandomInt(height), 1, 1);
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
