// this is an example preload script that links to the config after the DOM is loaded
const os = require('os');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = path.join(os.homedir(), 'Documents', 'OCE', 'Config', 'config.js');
    document.head.appendChild(script);
});
