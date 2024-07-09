const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let activeFilePath = null;

// Function to open folder selection dialog
function openFolderDialog() {
    ipcRenderer.send('open-folder-dialog');
}

// Event listener for button click

ipcRenderer.on('selected-folder', (event, folderPath) => {
    // Clear existing file tree
    const fileExplorer = document.getElementById('file-explorer');
    fileExplorer.innerHTML = '';

    // Build file tree for selected folder
    readDirectory(folderPath, fileExplorer);
});

function readDirectory(dirPath, parentNode) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        const ul = document.createElement('ul');

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const li = document.createElement('li');
                const itemContainer = document.createElement('div');
                itemContainer.className = 'item-container';

                if (stats.isFile()) {
                    const button = document.createElement('button');
                    button.textContent = file;
                    button.addEventListener('click', () => {
                        const editorId = `editor-${Date.now()}`;
                        openFolderFile(filePath, editorId);
                    });
                    itemContainer.appendChild(button);
                } else {
                    const folderSpan = document.createElement('span');
                    folderSpan.textContent = file;
                    folderSpan.classList.add('folder');
                    folderSpan.addEventListener('click', () => {
                        if (li.classList.contains('expanded')) {
                            li.classList.remove('expanded');
                            const childrenToRemove = Array.from(li.children).filter(child => child !== itemContainer);
                            childrenToRemove.forEach(child => li.removeChild(child));
                        } else {
                            li.classList.add('expanded');
                            readDirectory(filePath, li);
                        }
                    });
                    itemContainer.appendChild(folderSpan);
                }

                const renameButton = document.createElement('button');
                renameButton.textContent = 'Rename';
                renameButton.addEventListener('click', () => {
                    ipcRenderer.send('rename-file', filePath);
                });
                itemContainer.appendChild(renameButton);;

                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete ${file}?`)) {
                        if (stats.isDirectory()) {
                            fs.rmdir(filePath, { recursive: true }, (err) => {
                                if (err) {
                                    console.error(`Error deleting directory ${file}:`, err);
                                    alert(`Failed to delete directory ${file}`);
                                } else {
                                    readDirectory(dirPath, parentNode);
                                }
                            });
                        } else {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error(`Error deleting file ${file}:`, err);
                                    alert(`Failed to delete file ${file}`);
                                } else {
                                    readDirectory(dirPath, parentNode);
                                }
                            });
                        }
                    }
                });
                itemContainer.appendChild(deleteButton);

                li.appendChild(itemContainer);
                ul.appendChild(li);
            });
        });

        parentNode.appendChild(ul);
        toggleTheme();
        toggleTheme();
    });
}

// Function to add a new tab with file content to the editor
function openFolderFile(filePath, editorId) {
    const currentTheme = editor.getTheme();
    const newTab = document.createElement("button");
    newTab.className = "tab";
    newTab.textContent = path.basename(filePath); // Display file name in tab
    newTab.setAttribute("data-editor-id", editorId);
    newTab.addEventListener("click", switchToTab);

    document.getElementById("tabBar").appendChild(newTab);

    const newEditor = ace.edit(document.createElement("div"));
    newEditor.setOptions({
        maxLines: 38,
        minLines: 38,
    });
    newEditor.container.style.width = "99%";
    newEditor.container.style.height = "600px";
    newEditor.container.style.border = "1px solid #ccc";
    newEditor.container.style.marginTop = "10px";
    newEditor.container.style.border = "2px solid #cccccc";
    newEditor.container.style.borderRadius = "5px";
    newEditor.container.style.fontSize = fontSize;
    newEditor.container.style.fontFamily = fontFamily;

    newEditor.container.id = editorId;

    const extension = path.extname(filePath).slice(1); // Get file extension
    newEditor.session.setMode(`ace/mode/${extension}`);
    newTab.setAttribute("data-language", extension);
    newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
    newEditor.setOptions({
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
    });
    document.body.appendChild(newEditor.container);

    switchToTab({ target: newTab });
    const isDarkTheme = currentTheme === "ace/theme/monokai";
    const newTheme = isDarkTheme ? "ace/theme/monokai" : "ace/theme/chrome";
    newEditor.setTheme(newTheme);
    const backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    const textColor = isDarkTheme ? "#dddddd" : "#000000";

    document.querySelectorAll(".tab").forEach(function (tab) {
        tab.style.backgroundColor = backgroundColor;
        tab.style.color = textColor;
    });

    // Read file content and set it in the editor
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        newEditor.setValue(data);
    });
    activeFilePath = filePath;
    return activeFilePath;
}

function openFileDialog() {
    ipcRenderer.send('open-file-dialog');
}

// Listen for file selection event from the main process
ipcRenderer.on('file-selected', (event, filePath) => {
    displayFileContent(filePath);
});

function displayFileContent(filePath) {
    const editorId = `editor_${Date.now()}`;

// Create a new tab button
    const newTab = document.createElement("button");
    newTab.className = "tab";
    newTab.textContent = path.basename(filePath); // Display file name in tab
    newTab.setAttribute("data-editor-id", editorId);
    newTab.addEventListener("click", switchToTab);

// Append the tab button to the tabBar element
    document.getElementById("tabBar").appendChild(newTab);

// Create a new editor
    const newEditor = ace.edit(document.createElement("div"));
    newEditor.setOptions({
        maxLines: 38,
        minLines: 38,
    });
    newEditor.container.style.width = "99%";
    newEditor.container.style.height = "600px";
    newEditor.container.style.border = "1px solid #ccc";
    newEditor.container.style.marginTop = "10px";
    newEditor.container.style.border = "2px solid #cccccc";
    newEditor.container.style.borderRadius = "5px";
    newEditor.container.style.fontSize = fontSize;
    newEditor.container.style.fontFamily = fontFamily;

// Assign the unique ID to the editor container
    newEditor.container.id = editorId;

    let pre_extension = path.extname(filePath).slice(1);
    const fileExtensionMap = {
        py: 'python',
        js: 'javascript',
        kt: 'kotlin',
        cpp: 'c_cpp',
        rb: 'ruby',
        go: 'golang',
        md: 'markdown'
    };

    let extension = fileExtensionMap[pre_extension] || pre_extension;
    newEditor.session.setMode(`ace/mode/${extension}`);
    newTab.setAttribute("data-language", extension);
    newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
    newEditor.setOptions({
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
    });

    document.body.appendChild(newEditor.container);

    switchToTab({ target: newTab });
    toggleTheme();
    toggleTheme();

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        newEditor.setValue(data);
    });
    activeFilePath = filePath;
    return activeFilePath;

}

function saveToFile() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;
    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;
    const data = activeEditor.getValue();
    fs.writeFile(activeFilePath, data, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File saved successfully!");
    });
}

function saveFile() {
    const activeTab = document.querySelector(".tab.active");
    const editorId = activeTab.getAttribute("data-editor-id");
    const editor = document.getElementById(editorId);

    const code = editor.env.editor.getValue();

    const blob = new Blob([code], {type: "text/plain"});

    const fileName = activeTab.textContent.trim();
    if (!fileName) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const a = document.createElement("a");

        a.href = event.target.result;

        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
    };

    reader.readAsDataURL(blob);
}

function executeActiveFile() {
    if (!activeFilePath) {
        console.error('No active file path');
        return;
    }

    const fileExtension = path.extname(activeFilePath).toLowerCase();

    let command;

    switch (fileExtension) {
        case '.py':
            command = `python3 ${activeFilePath}`;
            break;
        case '.js':
            if (os.platform() === 'darwin') {
                const homebrewPath = '/opt/homebrew/bin';
                if (fs.existsSync(homebrewPath)) {
                    process.env.PATH = `${homebrewPath}:${process.env.PATH}`;
                } else {
                    // Homebrew path doesn't exist on Mac OS, skipping
                }
            }
            command = `node ${activeFilePath}`;
            break;
        case '.go':
            command = `go run ${activeFilePath}`;
            break;
        case '.rb':
            command = `ruby ${activeFilePath}`;
            break;
        case '.rs':
            command = `rustc ${activeFilePath} && ./${path.basename(activeFilePath, '.rs')}`;
            break;
        case '.cpp':
            command = `g++ ${activeFilePath} -o ${path.basename(activeFilePath, '.cpp')} && ./${path.basename(activeFilePath, '.cpp')}`;
            break;
        case '.c':
            command = `gcc ${activeFilePath} -o ${path.basename(activeFilePath, '.c')} && ./${path.basename(activeFilePath, '.c')}`;
            break;
        case '.kt':
            command = `kotlinc ${activeFilePath} -include-runtime -d ${path.basename(activeFilePath, '.kt')}.jar && java -jar ${path.basename(activeFilePath, '.kt')}.jar`;
            break;

        default:
            console.error(`Unsupported file type: ${fileExtension}`);
            return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${fileExtension} code:`, error.message);
            return;
        }
        if (stderr) {
            console.error(`${fileExtension} script encountered an error:`, stderr);
            return;
        }
        console.log(stdout);
    });
}

ipcRenderer.on('rename-complete', (event, success, error) => {
    if (success) {
        console.log('File renamed successfully');
        openFolderDialog();
    } else {
        console.error('Rename error:', error);
        alert(`Failed to rename file: ${error}`);
    }
});
