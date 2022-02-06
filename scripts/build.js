import {build} from 'esbuild';

const parameters = process.argv.slice(2); // eslint-disable-line node/prefer-global/process

/**
 * Iterate through the parameters and set the build parameters
 * @param {Array} parameters
 * @returns {Object}
 */
const getBuildParameters = parameters => {
	const buildParameters = {
		// Default options
		external: [],
		outdir: './dist',
		platform: 'node',
		watch: false,
	};

	// Iterate through the parameters and override the default options
	for (const parameter of parameters) {
		const [key, value] = parameter.split('=');
		buildParameters[key.replace('--', '')] = value ?? true;
	}

	if (buildParameters.outfile) {
		delete buildParameters.outdir;
	}

	if (buildParameters.entryPoints) {
		buildParameters.entryPoints = buildParameters.entryPoints.split(',');
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
}).catch(error => {
	console.error(error);
});
