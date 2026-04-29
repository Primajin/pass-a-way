import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'ava';

const distPath = './dist/';

// Helper function to clear the dist directory
const clearDist = () => {
	if (fs.existsSync(distPath)) {
		const files = fs.readdirSync(distPath);
		for (const file of files) {
			fs.unlinkSync(path.join(distPath, file));
		}
	}
};

test.after.always(() => {
	// Clean up the dist directory after all tests are done
	clearDist();
});

test.beforeEach(() => {
	// Ensure the dist directory exists and is empty before each test
	if (!fs.existsSync(distPath)) {
		fs.mkdirSync(distPath);
	}

	clearDist();
});

test('node script generates images without tempImage by default', async t => {
	// Check that the directory is empty initially
	let files = fs.readdirSync(distPath);
	t.is(files.length, 0);

	// Dynamically import the node script to execute it
	await import('../src/node/index.js');

	// Check that the expected files were created
	files = fs.readdirSync(distPath);
	t.false(files.includes('tempImage.png'));
	t.true(files.includes('image0.png'));
	t.true(files.includes('image1.png'));
	t.is(files.length, 2);
});

test('node script generates tempImage with --debug flag', t => {
	// Run the script in a subprocess with the --debug flag
	execFileSync('node', ['src/node/index.js', '--debug']);

	// Check that the tempImage was created along with the other images
	const files = fs.readdirSync(distPath);
	t.true(files.includes('tempImage.png'));
	t.true(files.includes('image0.png'));
	t.true(files.includes('image1.png'));
	t.is(files.length, 3);
});

test('node script generates tempImage with -d flag', t => {
	// Run the script in a subprocess with the -d flag
	execFileSync('node', ['src/node/index.js', '-d']);

	// Check that the tempImage was created along with the other images
	const files = fs.readdirSync(distPath);
	t.true(files.includes('tempImage.png'));
	t.true(files.includes('image0.png'));
	t.true(files.includes('image1.png'));
	t.is(files.length, 3);
});

test('node script generates 4 images with -n 4', t => {
	execFileSync('node', ['src/node/index.js', '-n', '4']);

	const files = fs.readdirSync(distPath);
	t.true(files.includes('image0.png'));
	t.true(files.includes('image1.png'));
	t.true(files.includes('image2.png'));
	t.true(files.includes('image3.png'));
	t.false(files.includes('tempImage.png'));
	t.is(files.length, 4);
});

test('node script shows help with -h', t => {
	const output = execFileSync('node', ['src/node/index.js', '-h'], {encoding: 'utf8'});
	t.true(output.includes('--number'));
	t.true(output.includes('--debug'));
	t.true(output.includes('--help'));
});

test('node script rejects invalid --number value', t => {
	const error = t.throws(() => {
		execFileSync('node', ['src/node/index.js', '-n', '1'], {encoding: 'utf8'});
	});
	t.truthy(error);
});
