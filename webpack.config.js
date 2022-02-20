const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'production',
	output: {
		clean: true,
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist/browser'),
	},
	entry: './src/browser/index.js',
};
