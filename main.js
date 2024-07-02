const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
app.name = 'Okral Editor';

const oceDir = path.join(os.homedir(), 'Documents', 'OCE');
const configDir = path.join(oceDir, 'Config');

function ensureOceDirectory() {
    if (!fs.existsSync(oceDir)) {
        fs.mkdirSync(oceDir);
    }
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }
}

let mainWindow;

// Function to create the main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 950,
        webPreferences: {
            contextIsolation: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }
    });

    mainWindow.loadFile('index.html');

    // Check for command-line arguments after the window is created
    const args = process.argv.slice(2); // Skip the first argument (path to electron)
    if (args.length > 0) {
        const filePath = args[0];
        openFile(filePath);
    }
}

function openFile(filePath) {
    // Send the file path to the renderer process
    if (mainWindow) {
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('file-selected', filePath);
        });
    }
}

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// When the app is ready
app.whenReady().then(() => {
    ensureOceDirectory();
    createWindow();

    const menuTemplate = [
        {
            label: 'Okral Code Editor',
            submenu: [
                {
                    label: 'Select Extensions Directory',
                    click: selectExtensionsDirectory
                },
                {
                    label: 'Quit',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'copy' },
                { role: 'paste' },
                { role: 'undo' },
                { role: 'redo' },
                { role: 'cut' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'togglefullscreen' },
                { role: 'toggleDevTools' },
                { role: 'minimize'}
            ]
        },
        {
            label: 'Zoom',
            submenu: [
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { role: 'resetZoom' },
            ]
        },
        {
            label: 'Help',
            submenu: [
                { role: 'about' },
                {
                    label: 'Wiki/Help',
                    click: () => {
                        require('electron').shell.openExternal('https://github.com/Okerew/okraleditor/wiki');
                    }
                },
                {
                    label: 'Keybinds',
                    click: () => {
                        require('electron').shell.openExternal('https://github.com/Okerew/okraleditor/wiki/Keybinds');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

function selectExtensionsDirectory() {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const selectedDirectory = result.filePaths[0];
            loadExtensions(selectedDirectory);
        } else {
            console.log('Extension directory selection canceled.');
        }
    }).catch(error => {
        console.error('Error selecting extension directory:', error);
    });
}

// IPC function to open folder selection dialog
ipcMain.on('open-folder-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            event.reply('selected-folder', result.filePaths[0]);
        }
    }).catch(err => {
        console.error(err);
    });
});

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            const filePath = result.filePaths[0];
            event.sender.send('file-selected', filePath);
        }
    }).catch(err => {
        console.log(err);
    });
});
