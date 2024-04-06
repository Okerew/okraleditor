const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.name = 'Okral Editor';

function loadExtensions() {
    const extensionsDir = path.join(__dirname, 'extensions');

    try {
        fs.readdirSync(extensionsDir).forEach(file => {
            if (file.endsWith('.js')) {
                const filePath = path.join(extensionsDir, file);
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
    loadExtensions();
    createWindow();
});
