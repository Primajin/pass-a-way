import fs from 'node:fs';
import canvasPKG from 'canvas';

const {createCanvas} = canvasPKG;

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.fillRect(0, 0, width, height);

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
