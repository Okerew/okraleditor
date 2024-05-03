const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { exec } = require('child_process');

const term = new Terminal();

term.open(document.getElementById('terminal'));

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
fitAddon.fit();

window.addEventListener('resize', () => fitAddon.fit());

let inputBuffer = '';

let cursorAtLineStart = true;

term.onData((data) => {
    const char = data;

    // Handle special keys
    if (char === '\r') { // Enter key
        executeCommand(inputBuffer);
        inputBuffer = ''; // Clear input buffer
        term.write('\n$ '); // Display a new prompt
        cursorAtLineStart = true;
    } else if (char === '\x7F') { // Backspace key
        if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1); // Remove last character
            term.write('\b \b'); // Clear the previous character
        }
    } else {
        inputBuffer += char;
        term.write(char);
        cursorAtLineStart = false;
    }
});

function executeCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            term.write(`Error executing command: ${error.message}\n`);
            return;
        }
        if (!cursorAtLineStart) {
            term.write('\n'); // Move to the next line if cursor is not at the beginning
        }
        term.write(stdout);
        term.write(stderr);
    });
}