const { app, BrowserWindow, dialog, Menu} = require('electron');
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
        width: 1400,
        height: 950,
        webPreferences: {
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js'),
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

    const menu = Menu.buildFromTemplate([
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
                {
                    label : 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role:"copy"
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role:"paste"
                },
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role:"undo"
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role:"redo"
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: "cut"
                }
            ]
        },
        {
          label: 'View',
          submenu: [
            {
                label: 'ZoomIn',
                accelerator: 'CmdOrCtrl+=',
                role:"zoomIn"
            },
            {
              label: 'ZoomOut',
              accelerator: 'CmdOrCtrl+-',
              role:"zoomOut"
            },
              {
                  label: 'ZoomReset',
                  accelerator: 'CmdOrCtrl+0',
                  role:"resetZoom"
              },
              {
                  label: 'FullScreen',
                  accelerator: 'F11',
                  role:"togglefullscreen"
              },
              {
                  label: 'Toggle Developer Tools',
                  accelerator: 'F12',
                  role:"toggleDevTools"
              }
          ]
        }
    ]);

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
