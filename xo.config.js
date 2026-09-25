/**
@type {import('xo').FlatXoConfig}
*/
const xoConfig = [
	{
		rules: {
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					groups: [['builtin', 'external'], ['parent', 'sibling'], 'index'],
				},
			],
			'jsdoc/reject-function-type': 'off',
		},
	},
	{
		// This project ships as a browser bundle plus a Node CLI, not an
		// importable library: there is no single JS entry point to declare via
		// `main`/`exports`/`bin`, and npm has always published the whole repo
		// (no `files` allowlist, verified against the published 0.1.0 tarball).
		// These two rules assume a conventional library layout that doesn't
		// apply here, so they're turned off rather than guessed at.
		files: ['package.json'],
		rules: {
			'package-json/prefer-files-field': 'off',
			'package-json/require-entry-point': 'off',
		},
	},
];

export default xoConfig;
