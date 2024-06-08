self.addEventListener('fetch', function(event) {
  event.respondWith(
    new Response('', {
      headers: {
        'Content-Security-Policy': "default-src 'none'; script-src 'self';"
      }
    })
  );
});

function executeJavaScriptCode(jsCode, editorId) {
  jsCode = jsCode.replace(/eval\s*\(/g, '');
  jsCode = jsCode.replace(/importScripts\s*\(/g, '');
  jsCode = jsCode.replace(/document\s*\./g, '');

  const functionRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*{([^]*)}/g;

  let match;
  while ((match = functionRegex.exec(jsCode)) !== null) {
    const functionName = match[1].trim();
    const functionParameters = match[2].split(',').map(param => param.trim());
    const functionBody = match[3];

    try {
      self[functionName] = new Function(...functionParameters, functionBody);
    } catch (error) {
      console.error(`Error creating function ${functionName}:`, error);
    }
  }
}

self.onmessage = function(event) {
  const { jsCode, editorId } = event.data;
  executeJavaScriptCode(jsCode, editorId);
};
