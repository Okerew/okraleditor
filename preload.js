
// this is an example preload script that links to the config after the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'config.js';
    document.head.appendChild(script);
});
