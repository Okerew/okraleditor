#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

const electronPath = path.resolve(__dirname, 'node_modules', '.bin', 'electron'); // If your path is different change it here
const actual_path = '{pathtomain.js}'
// Launch the Okral Code Editor with the specified filename
if (args.length === 1) {
    const fileName = args[0];
    const okralProcess = spawn(electronPath, [actual_path, fileName], {
        stdio: 'inherit'
    });

    okralProcess.on('close', (code) => {
        process.exit(code);
    });
} else {
    console.log('Usage: okraleditor <filename>');
}

// Note it only works with the electron app without compilation
