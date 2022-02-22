/* eslint max-depth: ["error", 5] */
/**
 * Measures the text length and chooses the best font size.
 * @param {string} text - The text to measure.
 * @param canvasContext - The canvas context to use.
 */
export const chooseBestFontSize = (text, canvasContext) => {
	let fontSize = 70;
	canvasContext.font = `bold ${fontSize}px monospace`;
	// Keep 30px margin and don't go below 31px font size - otherwise it becomes unreadable
	while	((canvasContext.measureText(text).width > canvasContext.canvas.width - 30) && fontSize > 31) {
		fontSize -= 1;
		canvasContext.font = `bold ${fontSize}px monospace`;
	}
};

/**
 * Generates two images based on the given text and randomizes the pixels between them.
 * @param {function} createCanvas - A function that creates a canvas element.
 * @param {function} randomInt - A function that generates a random integer.
 * @param {string} text - The text to be used in the image.
 * @returns {{images: canvas[], middlePoint: [number, number], temporaryImage: canvas}}
 */
export const generateImage = (createCanvas, randomInt, text) => {
	const IMAGE_SIZE = [800, 300]; // Image size
	const GENERATE_IMAGE_COUNT = 2; // How many images you would like to generate (2-10)

	const [width, height] = IMAGE_SIZE;
	const middlePoint = [width / 2, height / 2];

	const temporaryImage = createCanvas(width, height);
	const temporaryImageContext = temporaryImage.getContext('2d');

	temporaryImageContext.textAlign = 'center';
	temporaryImageContext.textBaseline = 'middle';
	temporaryImageContext.fillStyle = '#000';
	chooseBestFontSize(text, temporaryImageContext);
	temporaryImageContext.fillText(text, middlePoint[0], middlePoint[1]); // TODO: randomize position

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

	return {
		images,
		middlePoint,
		temporaryImage,
	};
};

export default generateImage;

/**
 * Adds a text with the passaway URL to the bottom of the image.
 * @param imageContext
 * @param {Array} middlePoint
 */
export const addUrl = (imageContext, middlePoint) => {
	imageContext.fillStyle = '#000';
	imageContext.font = 'bold 30pt Sans';
	imageContext.textAlign = 'center';
	imageContext.textBaseline = 'bottom';
	imageContext.fillText('pass-a-way.net', middlePoint[0], 300 - 10);
};
