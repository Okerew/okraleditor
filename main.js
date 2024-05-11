const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
app.name = 'Okral Editor';

let extensionsDir = path.join(os.homedir(), 'Documents', 'OCE', 'Extensions');

function loadExtensions(extensionsPath) {
    try {
        fs.readdirSync(extensionsPath).forEach(file => {
            if (file.endsWith('.js')) {
                const filePath = path.join(extensionsPath, file);
                require(filePath);
                console.log(`Loaded extension script: ${file}`);
            }
        });
    } catch (error) {
        console.error('Error loading extensions:', error);
    }
}

// Function to create the main window
function createWindow() {
    const mainWindow = new BrowserWindow({
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
}

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// When the app is ready
app.whenReady().then(() => {
    loadExtensions(extensionsDir);
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
                    click: () => app.quit()
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
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { role: 'resetZoom' },
                { role: 'togglefullscreen' },
                { role: 'toggleDevTools' }
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
            extensionsDir = result.filePaths[0];
            loadExtensions(extensionsDir);
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
    dialog.showOpenDialog( {
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            const filePath = result.filePaths[0];
            // Send the selected file path to the renderer process to load its content
            event.sender.send('file-selected', filePath);
        }
    }).catch(err => {
        console.log(err);
    });
});
