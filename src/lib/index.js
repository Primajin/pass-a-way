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

	return temporaryImage;
};
