const { exec } = require('child_process');
const os = require('os');

function executeJavaScriptCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const nodeCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.js');
    fs.writeFileSync(tempFilePath, nodeCode);

    // Execute Node.js code using child_process
    exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Node.js code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Node.js script encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executePythonCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const pythonCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.py');
    fs.writeFileSync(tempFilePath, pythonCode);

    exec(`python3 ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Python code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Python script encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function htmlOutput() {
    var x = document.getElementById("output-container");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function executeHtmlCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const htmlCode = activeEditor.getValue();

    const resultDiv = document.createElement("div");

    resultDiv.innerHTML = htmlCode;

    const scripts = resultDiv.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
    });

    const outputContainer = document.getElementById("output-container");
    outputContainer.innerHTML = "";

    outputContainer.appendChild(resultDiv);
}

function runMarkdown() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    const editorValue = activeEditor.getValue();

    const convertedHtml = convertToHtml(editorValue);

    const resultDiv = document.createElement("div");
    resultDiv.innerHTML = convertedHtml;

    const outputContainer = document.getElementById("output-container");
    outputContainer.innerHTML = "";
    outputContainer.appendChild(resultDiv);
}

function convertToHtml(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^#(.*?)(\n|$)/gm, '<h1>$1</h1>')
        .replace(/\n- (.*?)\n/g, '<ul><li>$1</li></ul>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function executeGoCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const goCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.go');
    fs.writeFileSync(tempFilePath, goCode);

    exec(`go run ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Go code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Go program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executeRubyCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");

    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const rubyCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary file in downloads folder
    const tempFilePath = path.join(downloadsPath, 'tempCodeRunner.rb');
    fs.writeFileSync(tempFilePath, rubyCode);

    exec(`ruby ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

        if (error) {
            console.error('Error executing Ruby code:', error.message);
            return;
        }
        if (stderr) {
            console.error('Ruby program encountered an error:', stderr);
            return;
        }
        console.log(stdout);
    });
}

function executeRustCode() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const rustCode = activeEditor.getValue();

    // Get the system's downloads folder path
    const downloadsPath = path.join(os.homedir(), 'Downloads');

    // Create a temporary directory in downloads folder
    const tempDirPath = path.join(downloadsPath, 'tempCodeRunnerRust');
    fs.mkdirSync(tempDirPath);

    const srcDirPath = path.join(tempDirPath, 'src');
    fs.mkdirSync(srcDirPath);

    const rustFilePath = path.join(srcDirPath, 'main.rs');
    fs.writeFileSync(rustFilePath, rustCode);

    const dependencies = parseDependencies(rustCode);

    // Write Cargo.toml with dependencies
    const cargoTomlContent = generateCargoToml(dependencies);
    const cargoTomlPath = path.join(tempDirPath, 'Cargo.toml');
    fs.writeFileSync(cargoTomlPath, cargoTomlContent);

    // Execute cargo build
    exec(`cd ${tempDirPath} && cargo build`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Rust code:', error.message);
            deleteTempDir(tempDirPath);
            return;
        }

        const debugFolderPath = path.join(tempDirPath, 'target', 'debug');

        // Check if the executable exists
        const executablePath = path.join(debugFolderPath, 'temp_code_runner_rust');
        if (!fs.existsSync(executablePath)) {
            console.error('Error: Executable not found.');
            deleteTempDir(tempDirPath);
            return;
        }

        // Run the executable
        exec(`cd ${debugFolderPath} && ./temp_code_runner_rust`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Rust executable:', error.message);
                deleteTempDir(tempDirPath);
                return;
            }
            if (stderr) {
                console.error('Rust executable encountered an error:', stderr);
                deleteTempDir(tempDirPath);
                return;
            }

            console.log(stdout);

            deleteTempDir(tempDirPath);
        });
    });
}

function parseDependencies(rustCode) {
    const dependencies = new Set();
    const lines = rustCode.split('\n');

    lines.forEach(line => {
        // Check if the line contains an extern crate declaration
        const match = line.match(/^\s*extern\s+crate\s+(\w+)\s*;/);
        if (match) {
            const dependency = match[1];
            dependencies.add(dependency);
        }
    });

    return Array.from(dependencies);
}

function generateCargoToml(dependencies) {
    let cargoTomlContent = '[package]\n';
    cargoTomlContent += 'name = "temp_code_runner_rust"\n';
    cargoTomlContent += 'version = "0.1.0"\n';
    cargoTomlContent += 'edition = "2018"\n\n';

    cargoTomlContent += '[dependencies]\n';
    dependencies.forEach(dep => {
        cargoTomlContent += `${dep} = "*"\n`;
    });

    return cargoTomlContent;
}

function deleteTempDir(tempDirPath) {
    fs.rmdirSync(tempDirPath, { recursive: true });
}
