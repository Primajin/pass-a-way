export const generateImage = createCanvas => {
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
			const index = Math.floor(Math.random() * images.length); // RandomInt(images.length);
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
		temporaryImage,
	};
};
