const oceDir = path.join(os.homedir(), 'Documents', 'OCE');
const extensionsDir = path.join(oceDir, 'Extensions');

// Function to load extensions from the extensions directory
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

loadExtensions(extensionsDir);
