const { Terminal } = require('xterm');
const { FitAddon } = require('@xterm/addon-fit');

let term;
let fitAddon;
let currentDirectory = process.env.HOME || process.cwd();

function initializeTerminal() {
    if (term) {
        term.dispose();
    }

    term = new Terminal({
        fontSize: 15,
        scrollback: 100,
        theme: {
            foreground: '#fcfcfc',
            background: '#000000',
            black: '#000000',
            red: '#a80000',
            green: '#00a800',
            yellow: '#a85400',
            blue: '#0000a8',
            magenta: '#a800a8',
            cyan: '#00a8a8',
            white: '#a8a8a8',
            brightBlack: '#545454',
            brightRed: '#fc5454',
            brightGreen: '#54fc54',
            brightYellow: '#fcfc54',
            brightBlue: '#5454fc',
            brightMagenta: '#fc54fc',
            brightCyan: '#54fcfc',
            brightWhite: '#fcfcfc'
        },
        rightClickSelectsWord: true
    });

    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(document.getElementById('terminal'));
    fitAddon.fit();

    term.writeln('Oce Terminal');
    prompt();

    let command = '';
    term.onData(e => {
        const char = e;
        if (char === '\r') {
            term.write('\r\n');
            if (command.trim() !== '') {
                runCommand(command);
            } else {
                prompt();
            }
            command = '';
        } else if (char.charCodeAt(0) === 127) {
            if (command.length > 0) {
                command = command.slice(0, -1);
                term.write('\b \b');
            }
        } else {
            command += e;
            term.write(e);
        }
    });
}

function prompt() {
    term.write(`\r\n${currentDirectory} $ `);
}

function clearTerminal() {
    term.clear();
    term.reset();
}

function writeToTerminal(data) {
    const lines = data.toString().split('\n');
    for (let line of lines) {
        if (line.trim() !== '') {
            term.writeln(line);
        }
    }
}

function runCommand(command) {
    clearTerminal();
    if (command.startsWith('cd ')) {
        const newDirectory = command.slice(3).trim();
        try {
            process.chdir(path.resolve(currentDirectory, newDirectory));
            currentDirectory = process.cwd();
        } catch (error) {
            term.writeln(`cd: ${error.message}`);
        }
        prompt();
    } else {
        const shell = exec(command, { cwd: currentDirectory, shell: true });

        let output = '';
        shell.stdout.on('data', (data) => {
            output += data;
        });

        shell.stderr.on('data', (data) => {
            output += data;
        });

        shell.on('close', (code) => {
            writeToTerminal(output);
            term.writeln(`\r\nCommand exited with code ${code}`);
            prompt();
        });
    }
}

initializeTerminal();
