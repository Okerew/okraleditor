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
  jsCode = sanitizeJavaScriptCode(jsCode);

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

  let result;
  try {
    result = new Function(jsCode)();
  } catch (error) {
    result = `Error: ${error.message}`;
  }

  self.postMessage(result);
}

self.onmessage = function(event) {
  const { jsCode, editorId } = event.data;
  executeJavaScriptCode(jsCode, editorId);
};

function sanitizeJavaScriptCode(jsCode) {
  const dangerousPatterns = [
    /eval\s*\(/g,
    /importScripts\s*\(/g,
    /document\s*\./g,
    /window\s*\./g,
    /self\s*\./g,
    /XMLHttpRequest\s*\(/g,
    /fetch\s*\(/g,
    /WebSocket\s*\(/g,
    /Worker\s*\(/g,
    /navigator\s*\./g,
    /localStorage\s*\./g,
    /sessionStorage\s*\./g,
    /IndexedDB\s*\./g,
    /postMessage\s*\(/g
  ];

  dangerousPatterns.forEach(pattern => {
    jsCode = jsCode.replace(pattern, '');
  });

  return jsCode;
}
