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

  const functionRegex = /function\s+([^\(]+)\(([^)]*)\)\s*{([^]*)}/g;

  let match;
  while ((match = functionRegex.exec(jsCode)) !== null) {
    const functionName = match[1];
    const functionParameters = match[2].split(',').map(param => param.trim());
    const functionBody = match[3];

    self[functionName] = new Function(...functionParameters, functionBody);
  }

  try {
    eval(jsCode); 
  } catch (error) {
    console.error('Error executing JavaScript code:', error);
  }
}


self.onmessage = function(event) {
  const { jsCode, editorId } = event.data;
  executeJavaScriptCode(jsCode, editorId);
};
