import {build} from 'esbuild';

const parameters = process.argv.slice(2); // eslint-disable-line n/prefer-global/process

/**
 * Iterate through the parameters and set the build parameters
 * @param {Array} parameters
 * @returns {Object}
 */
const getBuildParameters = parameters => {
	const buildParameters = {
		bundle: true,
		entryPoints: ['src/browser/index.js'],
		external: [],
		outfile: 'dist/browser/index.js',
		platform: 'browser',
		watch: false,
	};

	// Iterate through the parameters and overwrite the default options
	for (const parameter of parameters) {
		const [key, value] = parameter.split('=');
		buildParameters[key.replace('--', '')] = value ?? true;
	}

	if (buildParameters.watch) {
		buildParameters.watch = {
			onRebuild(error) {
				if (error) {
					console.error('watch build failed:', error);
				} else {
					console.log('Build complete', new Date().toLocaleString());
				}
			},
		};
		console.log('Watching for changes...');
	}

	return buildParameters;
};

build({
	...getBuildParameters(parameters),
}).then(() => {
	console.log('Build complete', new Date().toLocaleString());
	// eslint-disable-next-line unicorn/prefer-top-level-await
}).catch(error => {
	console.error(error);
});
