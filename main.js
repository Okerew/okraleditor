const { app, BrowserWindow, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

app.name = 'Okral Editor';

let extensionsDir = path.join(__dirname, 'extensions');

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

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            sandbox: true,
            preload: 'preload.js',
        }
    });

    mainWindow.loadFile('index.html');
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(() => {
    loadExtensions(extensionsDir);

    createWindow();

    // Create menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'Extensions',
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
        }
    ]);

    Menu.setApplicationMenu(menu);
});

function selectExtensionsDirectory() {
    // Ask the user to select the extensions directory
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
