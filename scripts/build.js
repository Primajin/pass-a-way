import * as esbuild from 'esbuild';

const parameters = process.argv.slice(2); // eslint-disable-line n/prefer-global/process

let watchmode = false;

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
		watchmode = true;
	}

	delete buildParameters.watch;

	return buildParameters;
};

const context = await esbuild.context({...getBuildParameters(parameters)});

if (watchmode) {
	try {
		console.log('Watching for changes...');
		await context.watch();
	} catch (error) {
		console.error(error);
	}
} else {
	await context.rebuild();
	context.dispose();
}
