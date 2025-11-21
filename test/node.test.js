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

test.beforeEach(t => {
    // Ensure the dist directory exists and is empty before each test
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }
    clearDist();
});

test.after.always(t => {
    // Clean up the dist directory after all tests are done
    clearDist();
});

test('node script generates images', async t => {
    // Check that the directory is empty initially
    let files = fs.readdirSync(distPath);
    t.is(files.length, 0);

    // Dynamically import the node script to execute it
    await import('../src/node/index.js');

    // Check that the expected files were created
    files = fs.readdirSync(distPath);
    t.true(files.includes('tempImage.png'));
    t.true(files.includes('image0.png'));
    t.true(files.includes('image1.png'));
    t.is(files.length, 3);
});
