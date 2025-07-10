const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
const languageSelect = document.getElementById("language-select");

languageSelect.addEventListener("change", function () {
  const selectedLanguage = languageSelect.value;
  editor.session.setMode("ace/mode/" + selectedLanguage);
});

function openFile(event) {
  const input = event.target;
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const newTab = document.createElement("button");
    newTab.className = "tab";
    newTab.textContent = file.name;
    newTab.addEventListener("click", switchToTab);

    const newEditor = ace.edit(document.createElement("div"));
    newEditor.setOptions({
      maxLines: 38,
      minLines: 38,
    });

    newEditor.setValue(reader.result);

    const editorId = `editor-${Date.now()}`;
    newEditor.container.id = editorId;

    const extension = file.name.split(".").pop();
    newEditor.session.setMode(`ace/mode/${extension}`);
    newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);

    newTab.setAttribute("data-editor-id", editorId);
    newEditor.container.style.width = "99%";
    newEditor.container.style.height = "600px";
    newEditor.container.style.border = "1px solid #ccc";
    newEditor.container.style.marginTop = "10px";
    newEditor.container.style.border = "2px solid #cccccc";
    newEditor.container.style.borderRadius = "5px";
    newEditor.container.style.fontSize = fontSize;
    newEditor.container.style.fontFamily = fontFamily;

    const language = document.getElementById("language-select").value;
    newEditor.session.setMode(`ace/mode/${extension}`);
    newTab.setAttribute("data-language", extension);
    newEditor.setOptions({
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
    });

    const closeButton = document.createElement("button");
    document.getElementById("tabBar").appendChild(newTab);

    document.body.appendChild(newEditor.container);

    switchToTab({ target: newTab });
    toggleTheme();
    toggleTheme();
  };

  reader.readAsText(file);
}

function saveFile() {
  const activeTab = document.querySelector(".tab.active");
  const editorId = activeTab.getAttribute("data-editor-id");
  const editor = document.getElementById(editorId);

  const code = editor.env.editor.getValue();

  const blob = new Blob([code], { type: "text/plain" });

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

function addTab() {
  const currentTheme = editor.getTheme();
  const newTab = document.createElement("button");
  newTab.className = "tab";
  newTab.textContent = `Tab ${
    document.getElementsByClassName("tab").length + 1
  }`;
  const editorId = `editor${Date.now()}`;
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

  const language = document.getElementById("language-select").value;
  newEditor.session.setMode(`ace/mode/${language}`);
  newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
  newTab.setAttribute("data-language", language);
  newEditor.setOptions({
    enableLiveAutocompletion: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
  });
  document.body.appendChild(newEditor.container);

  switchToTab({ target: newTab });
  toggleTheme();
  toggleTheme();
}

function switchToTab(event) {
  const tab = event.target;
  const editorId = tab.getAttribute("data-editor-id");
  const editor = document.getElementById(editorId);

  if (splitViewActive) {
    const leftPane = document.getElementById("left-pane");
    const rightPane = document.getElementById("right-pane");
    const activePane = leftPane.contains(editor) ? leftPane : rightPane;
    const inactivePane = activePane === leftPane ? rightPane : leftPane;

    // Move the clicked editor to the active pane
    activePane.innerHTML = "";
    activePane.appendChild(editor);
    editor.style.display = "block";
    ace.edit(editorId).resize();

    // If there's no editor in the inactive pane, move the next available one there
    if (inactivePane.children.length === 0) {
      const nextTab =
        tab.nextElementSibling || document.querySelector(".tab:first-child");
      if (nextTab && nextTab !== tab) {
        const nextEditorId = nextTab.getAttribute("data-editor-id");
        const nextEditor = document.getElementById(nextEditorId);
        inactivePane.appendChild(nextEditor);
        nextEditor.style.display = "block";
        ace.edit(nextEditorId).resize();
      }
    }
  } else {
    document
      .querySelectorAll(".ace_editor")
      .forEach((ed) => (ed.style.display = "none"));
    editor.style.display = "block";
    ace.edit(editorId).resize();
  }

  document
    .querySelectorAll(".tab.active")
    .forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
}

function closeTab(event) {
  const tab = event.target;
  const tabBar = document.getElementById("tabBar");

  tabBar.removeChild(tab);

  const editorId = tab.getAttribute("data-editor-id");
  const editor = ace.edit(editorId);
  editor.container.remove();
  editor.destroy();

  if (tab.classList.contains("active")) {
    const nextTab = tab.nextElementSibling || tabBar.firstChild;
    if (nextTab) {
      switchToTab({ target: nextTab });
    }
  }
}

document
  .getElementById("closeActiveTab")
  .addEventListener("click", function () {
    const activeTab = document.querySelector(".tab.active");
    if (activeTab) {
      closeTab({ target: activeTab });
    }
  });

function toggleTheme(theme) {
  const currentTheme = editor.getTheme();
  const newTheme =
    currentTheme === `ace/theme/${light_theme}`
      ? `ace/theme/${dark_theme}`
      : `ace/theme/${light_theme}`;

  const editorInstances = document.querySelectorAll(".ace_editor");
  for (const editorInstance of editorInstances) {
    const editor = ace.edit(editorInstance);
    editor.setTheme(newTheme);
  }

  const body = document.body;
  const isDarkTheme = newTheme === `ace/theme/${dark_theme}`;
  body.classList.toggle("dark-theme", isDarkTheme);
  body.classList.toggle("light-theme", !isDarkTheme);
  body.style.backgroundColor = isDarkTheme ? "#272822" : "#bdbdbd";
  body.style.color = isDarkTheme ? "#dddddd" : "#000000";

  const tabElements = document.querySelectorAll(".tab");
  for (const tabElement of tabElements) {
    tabElement.classList.toggle("dark-text", isDarkTheme);
    tabElement.classList.toggle("light-text", !isDarkTheme);
  }
  const buttonElements = document.querySelectorAll("button");
  for (const buttonElement of buttonElements) {
    buttonElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    buttonElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const divElements = document.querySelectorAll(".navbar");
  for (const divElement of divElements) {
    divElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    divElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const divElements2 = document.querySelectorAll(".tabBar");
  for (const divElement2 of divElements2) {
    divElement2.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    divElement2.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const inputElements = document.querySelectorAll("input");
  for (const inputElement of inputElements) {
    inputElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    inputElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const selectElements = document.querySelectorAll("select");
  for (const selectElement of selectElements) {
    selectElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    selectElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const h1Elements = document.querySelectorAll("h1");
  for (const h1Element of h1Elements) {
    h1Element.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const aElements = document.querySelectorAll("a");
  for (const aElement of aElements) {
    aElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }

  const editorElements = document.querySelectorAll(".ace_content");
  for (const editorElement of editorElements) {
    editorElement.classList.toggle("dark-text", isDarkTheme);
    editorElement.classList.toggle("light-text", !isDarkTheme);
  }
  const modalElements = document.querySelectorAll(".modal-content");
  for (const modalElement of modalElements) {
    modalElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
  }
  const ulElements = document.querySelectorAll("ul");
  for (const ulElement of ulElements) {
    ulElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    ulElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }
  const areaElements = document.querySelectorAll("textarea");
  for (const areaElement of areaElements) {
    areaElement.style.backgroundColor = isDarkTheme ? "#3b3b3b" : "#e0e0e0";
    areaElement.style.color = isDarkTheme ? "#dddddd" : "#000000";
  }
}

function setLanguageForActiveTab() {
  const languageSelect = document.getElementById("language-select");
  const selectedLanguage = languageSelect.value;

  const activeTab = document.querySelector(".tab.active");
  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  activeEditor.session.setMode("ace/mode/" + selectedLanguage);
}

const languageDropdown = document.getElementById("language-select");
languageSelect.addEventListener("change", setLanguageForActiveTab);

function openSettings() {
  document.getElementById("settingsModal").style.display = "block";
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
}

function fileOps() {
  document.getElementById("fileModal").style.display = "block";
}

function closefileOps() {
  document.getElementById("fileModal").style.display = "none";
}

function runCode() {
  document.getElementById("runModal").style.display = "block";
}

function closeRunCode() {
  document.getElementById("runModal").style.display = "none";
}

function gitOps() {
  document.getElementById("gitModal").style.display = "block";
}

function closeGitOps() {
  document.getElementById("gitModal").style.display = "none";
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

  // Separate script tags from the main process
  const { htmlContent, scriptContent } = separateScriptTags(htmlCode);

  const sanitizedHtml = DOMPurify.sanitize(htmlContent);

  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = "";

  const blob = new Blob(
    [
      `
  <!DOCTYPE html>
    <html>
    <head></head>
    <body>
      ${sanitizedHtml}
      <script>
        ${scriptContent}
      <\/script>
    </body>
    </html>
  `,
    ],
    { type: "text/html" }
  );

  const blobUrl = URL.createObjectURL(blob);

  // Create an iframe for sandboxed execution
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.sandbox = "allow-scripts";

  iframe.src = blobUrl;

  outputContainer.appendChild(iframe);
}


// Separate <script> tags from the HTML
function separateScriptTags(htmlCode) {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
  
  let htmlContent = htmlCode;
  let scriptContent = "";
  
  htmlCode = htmlCode.replace(scriptRegex, (match, script) => {
    scriptContent += script;
    return "";
  });

  return { htmlContent, scriptContent };
}

// Run the Markdown conversion
function runMarkdown() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  const editorValue = activeEditor.getValue();

  // Sanitize Markdown content before conversion
  const sanitizedMarkdown = DOMPurify.sanitize(editorValue);

  const convertedHtml = convertToHtml(sanitizedMarkdown);

  const resultDiv = document.createElement("div");
  resultDiv.innerHTML = convertedHtml;

  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = "";
  outputContainer.appendChild(resultDiv);

  applySyntaxHighlighting();
}

// Convert Markdown to HTML
function convertToHtml(markdown) {
  const noScripts = markdown.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  const noJavaScriptLinks = noScripts.replace(
    /\bhttps?:\/\/\S+\bjavascript:/gi,
    ""
  );
  const noDataURIImages = noJavaScriptLinks.replace(
    /\bdata:image\/\S+;base64,\S+/gi,
    ""
  );

  // Convert markdown to HTML
  return noDataURIImages
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/^###(.*?)(\n|$)/gm, "<h3>$1</h3>") // H3
    .replace(/^##(.*?)(\n|$)/gm, "<h2>$1</h2>") // H2
    .replace(/^#(.*?)(\n|$)/gm, "<h1>$1</h1>") // H1
    .replace(/\n[-*] (.*?)\n/g, "<ul><li>$1</li></ul>") // Bullet list with `-` and `*`
    .replace(/```(\s*[\w-]*?)\n([\s\S]*?)```/g, (match, lang, code) => { // Code block
      lang = lang.trim() || 'text';
      return `<div class="code-block" data-lang="${lang}">${code}</div>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline code
    .replace(/\$([^\$]+)\$/g, '<span class="math-inline">$$$1$$</span>'); // Inline math
}

// Apply syntax highlighting for code blocks using Ace.js
function applySyntaxHighlighting() {
  const actual_editor = ace.edit("editor");
  const currentTheme = actual_editor.getTheme();
  
  const codeBlocks = document.querySelectorAll('.code-block');
  
  codeBlocks.forEach(block => {
    const lang = block.getAttribute('data-lang') || 'text';

    const editorDiv = document.createElement('div');
    editorDiv.style.width = "100%";
    editorDiv.style.height = "100px";
    block.replaceWith(editorDiv);

    const editor = ace.edit(editorDiv);
    editor.setTheme(currentTheme);
    editor.session.setMode(`ace/mode/${lang}`);
    editor.setValue(block.textContent.trim(), -1);
    editor.setReadOnly(true);
  });
}


function loadExtensions() {
  var username = "Okerew";
  var repoName = "okraleditorlibs";
  var fileName = prompt("Enter extension name:");

  // Sanitize inputs to prevent injection attacks
  if (!isValidFileName(fileName)) {
    console.error(
      "Invalid input. Please enter valid GitHub username, repository name, and file name."
    );
    return;
  }

  var script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/" +
    username +
    "/" +
    repoName +
    "/" +
    fileName +
    ".js";
  script.onload = function () {
    console.log("Extension " + fileName + " loaded successfully!");
  };
  document.head.appendChild(script);
}

function isValidInput(input) {
  var regex = /^[a-zA-Z0-9\-]+$/;
  return regex.test(input);
}

function isValidFileName(fileName) {
  var regex = /^[a-zA-Z0-9\-_\.]+$/;
  return regex.test(fileName);
}

async function loadRepoFiles() {
  const username = prompt("Enter the GitHub username:");
  if (!username || !isValidFileName(username)) {
    console.error("GitHub username not provided.");
    return;
  }

  const repo = prompt("Enter the repository name:");
  if (!repo || !isValidFileName(repo)) {
    console.error("Repository name not provided.");
    return;
  }

  const container = document.createElement("div");
  container.id = "fileTreeContainer";

  const repoUrl = `https://api.github.com/repos/${username}/${repo}/contents`;

  try {
    const response = await fetch(repoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch repository contents");
    }
    const data = await response.json();

    await createGitFileTree("", container, username, repo);

    container.style.display = "block";
  } catch (error) {
    console.error("Error loading repository files:", error);
    alert(
      "Error loading repository files. Please check the console for details."
    );
  }

  document.body.appendChild(container);
}

async function createGitFileTree(dirPath, parentNode, username, repo) {
  const repoUrl = `https://api.github.com/repos/${username}/${repo}/contents${dirPath}`;

  try {
    const response = await fetch(repoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch directory contents");
    }
    const data = await response.json();

    const ul = document.createElement("ul");

    for (const item of data) {
      const li = document.createElement("li");
      const itemName = item.name;

      if (item.type === "file") {
        const button = document.createElement("button");
        button.textContent = itemName;
        button.addEventListener("click", async () => {
          const fileUrl = item.download_url;
          const fileContent = await fetch(fileUrl).then((response) =>
            response.text()
          );
          const editorId = `editor-${Date.now()}`;
          openGitFolderFile(fileContent, editorId);
        });
        li.appendChild(button);
      } else if (item.type === "dir") {
        const button = document.createElement("button");
        button.textContent = itemName;
        button.classList.add("folder");
        button.addEventListener("click", async () => {
          // Clear the parent node
          ul.innerHTML = "";
          // Recursively create file tree for the directory
          await createGitFileTree(`${dirPath}/${itemName}`, li, username, repo);
        });
        li.appendChild(button);
      }

      ul.appendChild(li);
    }

    parentNode.appendChild(ul);
  } catch (error) {
    console.error("Error creating file tree:", error);
    alert("Error creating file tree. Please check the console for details.");
  }
}

function openGitFolderFile(fileContent, editorId) {
  const newTab = document.createElement("button");
  newTab.className = "tab";
  newTab.textContent = "New File";
  newTab.addEventListener("click", switchToTab);

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

  newEditor.setValue(fileContent);
  const language = document.getElementById("language-select").value;
  newEditor.session.setMode(`ace/mode/${language}`);
  newTab.setAttribute("data-language", language);
  newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
  newEditor.container.id = editorId;
  newTab.setAttribute("data-editor-id", editorId);

  document.getElementById("tabBar").appendChild(newTab);
  document.body.appendChild(newEditor.container);
  switchToTab({ target: newTab });
  toggleTheme();
  toggleTheme();
}

function pushToGithub() {
  const username = prompt("Enter your GitHub username:");
  if (!username || !isValidFileName(username)) {
    console.error("GitHub username not provided.");
    return;
  }

  const repo = prompt("Enter the name of your repository:");
  if (!repo || !isValidFileName(repo)) {
    console.error("Invalid repository name provided.");
    return;
  }

  if (!token || !isValidFileName(token)) {
    console.error("GitHub token not provided.");
    return;
  }

  const filename = prompt("Enter the filename to save as:");
  if (!filename || !isValidFileName(filename)) {
    console.error("Filename not provided.");
    return;
  }

  const commitMessage = prompt("Enter your commit message:");
  if (!commitMessage || !isValidFileName(commitMessage)) {
    console.error("Commit message not provided.");
    return;
  }

  const branchName = prompt("Enter the name of the branch to commit to:");
  if (!branchName || !isValidFileName(branchName)) {
    console.error("Branch name not provided.");
    return;
  }

  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) {
    console.error("No active tab found.");
    return;
  }
  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  const code = activeEditor.getValue();

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(
    filename
  )}`;

  const data = {
    message: commitMessage,
    content: btoa(unescape(encodeURIComponent(code))),
    branch: branchName,
  };

  fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to push changes to the branch");
      }
      console.log("Changes pushed to branch successfully");
      alert("Changes pushed to branch successfully!");
    })
    .catch((error) => {
      console.error("Error pushing changes to branch:", error);
      alert(
        "Error pushing changes to branch. Please check the console for details."
      );
    });
}

function mergeBranches() {
  const username = prompt("Enter your GitHub username:");
  if (!username || !isValidFileName(username)) {
    console.error("GitHub username not provided.");
    return;
  }

  const repo = prompt("Enter the name of your repository:");
  if (!repo || !isValidFileName(repo)) {
    console.error("Repository name not provided.");
    return;
  }

  const baseBranch = prompt("Enter the name of the base branch:");
  if (!baseBranch || !isValidFileName(baseBranch)) {
    console.error("Base branch name not provided.");
    return;
  }

  const headBranch = prompt("Enter the name of the branch to merge:");
  if (!headBranch || !isValidFileName(headBranch)) {
    console.error("Head branch name not provided.");
    return;
  }

  if (!token || !isValidFileName(token)) {
    console.error("GitHub token not provided.");
    return;
  }

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/merges`;

  const data = {
    base: baseBranch,
    head: headBranch,
    commit_message: "Merge branch",
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to merge branches");
      }
      console.log("Branches merged successfully");
      alert("Branches merged successfully!");
    })
    .catch((error) => {
      console.error("Error merging branches:", error);
      alert("Error merging branches. Please check the console for details.");
    });
}

function executeCodeInWorker() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");

  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;
  const jsCode = activeEditor.getValue();

  const worker = new Worker("worker.js");

  worker.postMessage({ jsCode, editorId });
}

function encryptConfig(config, key) {
  const encrypted = CryptoJS.AES.encrypt(config, key);
  return encrypted.toString();
}

function decryptConfig(encryptedConfig, key) {
  const decrypted = CryptoJS.AES.decrypt(encryptedConfig, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

async function encryptOnServer(config) {
  const response = await fetch(
    "https://candle-cheerful-warlock.glitch.me/encrypt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ config }),
    }
  );

  const data = await response.json();
  return data.encryptedConfig;
}

async function decryptOnServer(encryptedConfig) {
  const response = await fetch(
    "https://candle-cheerful-warlock.glitch.me/decrypt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedConfig }),
    }
  );

  const data = await response.json();
  return data.config;
}

async function saveToCookie() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const unsafe_config = activeEditor.getValue();
  const config = DOMPurify.sanitize(unsafe_config);

  // Generate a random key
  const key = generateRandomKey();

  const encryptedConfig = encryptConfig(config, key);
  const doublyEncryptedConfig = await encryptOnServer(encryptedConfig);

  const now = new Date();
  // Calculate expiration date (30 days from now)
  const expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  document.cookie = `encryptedConfig=${encodeURIComponent(
    doublyEncryptedConfig
  )}; expires=${expirationDate.toUTCString()}; path=/; SameSite=None; Secure`;

  localStorage.setItem("encryptionKey", key);
}

async function loadFromCookie() {
  const cookies = document.cookie.split(";");
  let doublyEncryptedConfig = null;

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("encryptedConfig=")) {
      doublyEncryptedConfig = decodeURIComponent(
        cookie.substring("encryptedConfig=".length)
      );
      break;
    }
  }

  if (!doublyEncryptedConfig) return;

  const serverDecryptedConfig = await decryptOnServer(doublyEncryptedConfig);
  const key = localStorage.getItem("encryptionKey");

  if (!key) {
    console.error("Encryption key not found!");
    return;
  }

  const config = decryptConfig(serverDecryptedConfig, key);

  const scriptTag = document.createElement("script");
  scriptTag.textContent = config;
  document.body.appendChild(scriptTag);
}

loadFromCookie();

function generateRandomKey() {
  // Generate a random string to be used as the key
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
}

function hideFileTree() {
  const fileTreeContainer = document.getElementById("fileTreeContainer");
  if (fileTreeContainer.style.display === "block") {
    fileTreeContainer.style.display = "none";
  } else {
    fileTreeContainer.style.display = "block";
  }
}

if (typeof keyboard_mode == "undefined") {
  keyboard_mode = null;
}

if (typeof fontSize == "undefined") {
  fontSize = "15px";
}

if (typeof fontFamily == "undefined") {
  fontFamily = "monospace";
}

if (typeof light_theme == "undefined") {
  light_theme = "chrome";
}

if (typeof dark_theme == "undefined") {
  dark_theme = "monokai";
}

async function pushAllToGithub() {
  const username = prompt("Enter your GitHub username:");
  if (!username || !isValidFileName(username)) {
    console.error("GitHub username not provided or invalid.");
    return;
  }

  const repo = prompt("Enter the name of your repository:");
  if (!repo || !isValidFileName(repo)) {
    console.error("Invalid repository name provided.");
    return;
  }

  if (!token) {
    console.error("GitHub token not provided.");
    return;
  }

  const commitMessage = prompt("Enter your commit message:");
  if (!commitMessage) {
    console.error("Commit message not provided.");
    return;
  }

  const branchName = prompt("Enter the name of the branch to commit to:");
  if (!branchName || !isValidFileName(branchName)) {
    console.error("Branch name not provided or invalid.");
    return;
  }
  const editorInstances = document.querySelectorAll(".ace_editor");

  for (let i = 1; i < editorInstances.length; i++) {
    const editorInstance = editorInstances[i];
    const tabName = prompt("Enter file name: ");
    if (!tabName || !isValideFileName(tabName)) {
      console.error("File name not provided");
      return;
    }
    const editorId = editorInstance.id;
    const editor = ace.edit(editorId);
    const code = editor.getValue();

    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(
      tabName
    )}`;

    const data = {
      message: commitMessage,
      content: btoa(unescape(encodeURIComponent(code))),
      branch: branchName,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to push changes for ${tabName}`);
      }

      console.log(`Changes for ${tabName} pushed successfully`);
    } catch (error) {
      console.error(`Error pushing changes for ${tabName}:`, error);
    }
  }

  alert("All changes pushed to GitHub successfully!");
}

function beautifyCode() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const editorValue = activeEditor.getValue();

  const language = prompt("Enter the language (js - javascript, html, css):");
  if (!language || !isValidFileName(language)) {
    console.error("There was a mistake please try again. ");
    return;
  }
  let beautifiedCode;
  switch (language.toLowerCase()) {
    case "js":
      beautifiedCode = js_beautify(editorValue, { indent_size: 2 });
      break;
    case "html":
      beautifiedCode = html_beautify(editorValue, { indent_size: 2 });
      break;
    case "css":
      beautifiedCode = css_beautify(editorValue, { indent_size: 2 });
      break;
    default:
      alert("Unsupported language");
      return;
  }

  activeEditor.setValue(beautifiedCode, 1);
}

function getServerUrl() {
  return new Promise((resolve, reject) => {
    const url = prompt(
      "Please enter the collaborative server URL: ",
      "https://thin-sprout-cactus.glitch.me/"
    );
    if (url) {
      resolve(url);
    } else {
      reject("Server URL is required to connect to the collaborative server.");
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function connectToCollaborativeServer() {
  getServerUrl()
    .then((serverUrl) => {
      const socket = io(serverUrl);

      function sendEditorValue() {
        const activeTab = document.querySelector(".tab.active");
        if (!activeTab) return;

        const editorId = activeTab.getAttribute("data-editor-id");
        const activeEditor = ace.edit(editorId);
        if (!activeEditor) return;

        const editorValue = activeEditor.getValue();
        socket.emit("editorChange", editorValue);
      }

      const activeTab = document.querySelector(".tab.active");
      if (!activeTab) return;

      const editorId = activeTab.getAttribute("data-editor-id");
      const activeEditor = ace.edit(editorId);
      const debouncedSendEditorValue = debounce(sendEditorValue, 1000);

      activeEditor.session.on("change", debouncedSendEditorValue);

      socket.on("updateEditor", (editorValue) => {
        const activeTab = document.querySelector(".tab.active");
        if (!activeTab) return;

        const editorId = activeTab.getAttribute("data-editor-id");
        const activeEditor = ace.edit(editorId);
        if (!activeEditor) return;

        activeEditor.setValue(editorValue);
      });
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
}
 
function saveCodeSnippet() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const codeSnippet = activeEditor.getValue();

  const snippetName = prompt("Enter a name for the code snippet:");

  if (snippetName) {
    // Save the code snippet to local storage
    localStorage.setItem(snippetName, codeSnippet);
    alert(`Code snippet "${snippetName}" saved successfully!`);
  } else {
    alert("No name provided. Snippet not saved.");
  }
}

function loadCodeSnippet() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const snippetNames = Object.keys(localStorage);
  const snippetList = document.getElementById("snippetList");
  snippetList.innerHTML = "";

  snippetNames.forEach((snippetName) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = snippetName;
    link.onclick = function () {
      loadSnippetAndClose(snippetName);
    };
    listItem.appendChild(link);

    const deleteButton = document.createElement("span");
    deleteButton.textContent = "✖";
    deleteButton.className = "delete";
    deleteButton.onclick = function (event) {
      event.stopPropagation();
      deleteSnippet(snippetName, listItem);
    };
    listItem.appendChild(deleteButton);

    snippetList.appendChild(listItem);
  });

  const modal = document.getElementById("snippetModal");
  modal.style.display = "block";

  const closeModal = document.querySelector(".close");
  closeModal.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  function loadSnippetAndClose(snippetName) {
    const codeSnippet = localStorage.getItem(snippetName);
    if (codeSnippet) {
      activeEditor.setValue(codeSnippet);
      modal.style.display = "none";
    }
  }

  function deleteSnippet(snippetName, listItem) {
    localStorage.removeItem(snippetName);
    listItem.remove();
  }
}

function closeSnipetOps() {
  document.getElementById("snippetModal").style.display = "none";
}
function generateProjectOutline() {
  try {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const editorValue = activeEditor.getValue();
    const language = activeEditor.session.getMode().$id;

    let outline;
    if (language.includes("javascript")) {
      outline = parseJavaScript(editorValue);
    } else if (language.includes("c_cpp")) {
      outline = parseCPP(editorValue);
    } else if (language.includes("rust")) {
      outline = parseRust(editorValue);
    } else if (language.includes("python")) {
      outline = parsePython(editorValue);
    } else if (language.includes("go")) {
      outline = parseGo(editorValue);
    } else if (language.includes("kotlin")) {
      outline = parseKotlin(editorValue);
    } else if (language.includes("jsx")) {
      outline = parseJavaScript(editorValue);
    } else if (language.includes("markdown")) {
       runMarkdown();
    } else {
      console.log("Unsupported language for outline generation");
      return;
    }
    
    displayOutline(outline, activeEditor);
  } catch (error) {
    console.error("Error generating project outline:", error);
  }
}

function displayOutline(outline, activeEditor) {
  const outlineElement = document.createElement("div");
  outlineElement.id = "projectOutline";

  outline.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("outline-item");

    if (item.type === "Error") {
      // Handle error items
      itemElement.textContent = `Error: ${item.errorType} - ${item.message}`;
      itemElement.classList.add("error-item");
    } else if (item.loc) {
      // Handle non-error items
      itemElement.textContent = `${item.type}: ${item.name}`;
    } else {
      // Skip items without location information
      return;
    }

    itemElement.style.cursor = "pointer";
    itemElement.onclick = () => {
      if (item.loc) {
        activeEditor.scrollToLine(
          item.loc.start.line - 1,
          true,
          true,
          function () {}
        );
        activeEditor.gotoLine(item.loc.start.line, item.loc.start.column, true);
      }
    };
    outlineElement.appendChild(itemElement);
  });

  const existingOutlineElement = document.querySelector("#projectOutline");
  if (existingOutlineElement) {
    existingOutlineElement.parentNode.replaceChild(
      outlineElement,
      existingOutlineElement
    );
  } else {
    document.body.appendChild(outlineElement);
  }
}

const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

const checkLanguageAndSetCallback = () => {
  try {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);

    if (activeEditor) {
      const language = activeEditor.session.getMode().$id;
      if (
        language.includes("javascript") ||
        language.includes("c_cpp") ||
        language.includes("rust") ||
        language.includes("python") ||
        language.includes("golang") ||
        language.includes("kotlin") ||
        language.includes("markdown") ||
        language.includes("jsx")
      ) {
        activeEditor.session.off("change", generateProjectOutline);
        activeEditor.session.on("change", generateProjectOutline);
      } else {
        activeEditor.session.off("change", generateProjectOutline);
      }
    }
  } catch (error) {
    console.error("Error checking language and setting callback:", error);
  }
};

const callback = function (mutationsList, observer) {
  checkLanguageAndSetCallback();
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

const activeTab = document.querySelector(".tab.active");
if (activeTab) {
  checkLanguageAndSetCallback();
}

// Check language every second
setInterval(checkLanguageAndSetCallback, 1000);


function removeStructure() {
  try {
    const outlineElement = document.getElementById("projectOutline");
    if (outlineElement) {
      outlineElement.remove();
    }
  } catch (error) {
    console.error("Error removing project outline:", error);
  }
}

class EditorHistory {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.lastSnapshot = null;
    this.startAutoCapture();
  }

  startAutoCapture() {
    setInterval(() => {
      this.captureSnapshot();
    }, 5000);
  }

  captureSnapshot() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;
    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;
    const codeSnippet = activeEditor.getValue();

    if (this.lastSnapshot && this.lastSnapshot.codeSnippet === codeSnippet)
      return;

    const timestamp = new Date();
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    this.history.push({ editorId, codeSnippet, timestamp });
    this.currentIndex++;
    this.lastSnapshot = { editorId, codeSnippet };
    this.updateSnapshotList();
  }

  restoreSnapshot(index) {
    const snapshot = this.history[index];
    if (!snapshot) return;
    const activeEditor = ace.edit(snapshot.editorId);
    if (!activeEditor) return;
    activeEditor.setValue(snapshot.codeSnippet, -1);
    this.currentIndex = index;
    this.lastSnapshot = snapshot;
  }

  updateSnapshotList() {
    const snapshotList = document.getElementById("snapshotList");
    snapshotList.innerHTML = "";
    this.history.forEach((snapshot, index) => {
      const li = document.createElement("li");
      li.textContent = `Editor ID: ${
        snapshot.editorId
      }, Timestamp: ${snapshot.timestamp.toLocaleString()}`;
      li.onclick = () => {
        this.restoreSnapshot(index);
        document.getElementById("snapshotModal").style.display = "none";
      };
      snapshotList.appendChild(li);
    });
  }
}

const editorHistory = new EditorHistory();

function snapOps() {
  document.getElementById("snapshotModal").style.display = "block";
}

function hideSnapOps() {
  document.getElementById("snapshotModal").style.display = "none";
}

function chatOps() {
  document.getElementById("chatbotModal").style.display = "block";
}

function hideChatOps() {
  document.getElementById("chatbotModal").style.display = "none";
}

async function loadServerFiles() {
  const directoryPath = prompt("Enter the directory path to load:");
  if (!directoryPath) {
    console.error("Directory path not provided.");
    return;
  }

  const container = document.createElement("div");
  container.id = "fileTreeContainer";

  try {
    await createFileTreeFromServer("", container, directoryPath);

    container.style.display = "block";
  } catch (error) {
    console.error("Error loading files from server:", error);
    alert(
      "Error loading files from server. Please check the console for details."
    );
  }

  document.body.appendChild(container);
}

let activeFilePath;
let remoteFileServerUrl;
async function createFileTreeFromServer(dirPath, parentNode, basePath) {
  remoteFileServerUrl = prompt(
    "Enter the remote server url: ",
    "https://mango-separate-leotard.glitch.me/"
  );
  const serverUrl = `${remoteFileServerUrl}/files?path=${encodeURIComponent(
    basePath + dirPath
  )}`;

  try {
    const response = await fetch(serverUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch directory contents");
    }
    const data = await response.json();

    const ul = document.createElement("ul");
    ul.id = "remoteFileTree";

    for (const item of data) {
      const li = document.createElement("li");
      const itemName = item.name;

      if (item.type === "file") {
        const button = document.createElement("button");
        button.textContent = itemName;
        button.addEventListener("click", async () => {
          const fileUrl = `${remoteFileServerUrl}/open-file?path=${encodeURIComponent(
            basePath + dirPath + "/" + itemName
          )}`;
          const fileContent = await fetch(fileUrl).then((response) =>
            response.text()
          );
          const editorId = `editor-${Date.now()}`;
          activeFilePath = basePath + dirPath + "/" + itemName;
          openFileInEditor(fileContent, editorId, itemName);
          return activeFilePath;
        });
        li.appendChild(button);
      } else if (item.type === "dir") {
        const button = document.createElement("button");
        button.textContent = itemName;
        button.classList.add("folder");
        button.addEventListener("click", async () => {
          // Clear the parent node
          li.innerHTML = "";
          // Recursively create file tree for the directory
          await createFileTreeFromServer(
            `${dirPath}/${itemName}`,
            li,
            basePath
          );
        });
        li.appendChild(button);
      }

      ul.appendChild(li);
    }

    parentNode.appendChild(ul);
    return remoteFileServerUrl;
  } catch (error) {
    console.error("Error creating file tree:", error);
    alert("Error creating file tree. Please check the console for details.");
  }
}

function openFileInEditor(fileContent, editorId, fileName) {
  const newTab = document.createElement("button");
  newTab.className = "tab";
  newTab.textContent = fileName; // Use the provided fileName
  newTab.addEventListener("click", switchToTab);

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

  newEditor.setValue(fileContent);
  const language = document.getElementById("language-select").value;
  newEditor.session.setMode(`ace/mode/${language}`);
  newTab.setAttribute("data-language", language);
  newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
  newEditor.container.id = editorId;
  newTab.setAttribute("data-editor-id", editorId);

  document.getElementById("tabBar").appendChild(newTab);
  document.body.appendChild(newEditor.container);
  switchToTab({ target: newTab });
  toggleTheme();
  toggleTheme();
}

async function executeRemoteActiveFile() {
  if (!activeFilePath) {
    console.error("No active file path");
    return;
  }

  try {
    const response = await fetch(
      `${remoteFileServerUrl}/execute-file?path=${encodeURIComponent(
        activeFilePath
      )}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    if (result.error) {
      console.error(`Error executing file: ${result.error}`);
    } else {
      console.log(result.output);
    }
  } catch (error) {
    console.error("Error executing file:", error);
  }
}

function remoteFileTree() {
  var x = document.getElementById("remoteFileTree");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

async function saveRemoteActiveFile() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const fileContent = activeEditor.getValue();

  try {
    const response = await fetch(`${remoteFileServerUrl}/save-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: activeFilePath,
        content: fileContent,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save the file");
    }

    const result = await response.json();
    if (result.error) {
      console.error(`Error saving file: ${result.error}`);
    } else {
      console.log("File saved successfully");
    }
  } catch (error) {
    console.error("Error saving file:", error);
  }
}

let splitViewActive = false;

function createSplitViewContainer() {
  const container = document.createElement("div");
  container.id = "split-container";
  container.style.display = "flex";
  container.style.height = "600px";
  container.style.width = "100%";

  const leftPane = document.createElement("div");
  leftPane.id = "left-pane";
  leftPane.style.flex = "1";
  leftPane.style.marginRight = "5px";

  const rightPane = document.createElement("div");
  rightPane.id = "right-pane";
  rightPane.style.flex = "1";
  rightPane.style.marginLeft = "5px";

  container.appendChild(leftPane);
  container.appendChild(rightPane);

  return container;
}

function toggleSplitView() {
  const existingContainer = document.getElementById("split-container");
  const editorContainers = document.querySelectorAll(".ace_editor");

  if (existingContainer) {
    // Disable split view
    splitViewActive = false;
    editorContainers.forEach((editor) => {
      editor.style.display = "none";
      document.body.appendChild(editor);
    });
    existingContainer.remove();
    const activeTab = document.querySelector(".tab.active");
    if (activeTab) {
      switchToTab({ target: activeTab });
    }
  } else {
    // Enable split view
    splitViewActive = true;
    const container = createSplitViewContainer();
    document.body.appendChild(container);
    const leftPane = document.getElementById("left-pane");
    const rightPane = document.getElementById("right-pane");

    // Move the active editor to the left pane
    const activeTab = document.querySelector(".tab.active");
    if (activeTab) {
      const activeEditorId = activeTab.getAttribute("data-editor-id");
      const activeEditor = document.getElementById(activeEditorId);
      leftPane.appendChild(activeEditor);
      activeEditor.style.display = "block";
      ace.edit(activeEditorId).resize();
    }

    // Move the next editor (if exists) to the right pane
    const nextTab =
      activeTab.nextElementSibling ||
      document.querySelector(".tab:first-child");
    if (nextTab && nextTab !== activeTab) {
      const nextEditorId = nextTab.getAttribute("data-editor-id");
      const nextEditor = document.getElementById(nextEditorId);
      rightPane.appendChild(nextEditor);
      nextEditor.style.display = "block";
      ace.edit(nextEditorId).resize();
    }
  }
}

let zenModeActive = false;

function toggleZenMode() {
  zenModeActive = !zenModeActive;
  const editorContainers = document.querySelectorAll(".ace_editor");
  const tabBar = document.getElementById("tabBar");
  const navbar = document.querySelector(".navbar");

  if (zenModeActive) {
    // Enter Zen mode
    editorContainers.forEach((editor) => {
      editor.style.position = "fixed";
      editor.style.top = "0";
      editor.style.left = "0";
      editor.style.width = "100%";
      editor.style.height = "100%";
      editor.style.zIndex = "1000";
    });
    tabBar.style.display = "none";
    navbar.style.display = "none";
  } else {
    // Exit Zen mode
    editorContainers.forEach((editor) => {
      editor.style.position = "";
      editor.style.top = "";
      editor.style.left = "";
      editor.style.width = "99%";
      editor.style.height = "600px";
      editor.style.zIndex = "";
    });
    tabBar.style.display = "";
    navbar.style.display = "";
  }

  // Resize the active editor
  const activeTab = document.querySelector(".tab.active");
  if (activeTab) {
    const editorId = activeTab.getAttribute("data-editor-id");
    ace.edit(editorId).resize();
  }
}

document.addEventListener("keydown", function (e) {
  // Check for Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
    e.preventDefault(); // Prevent default browser behavior
    toggleZenMode();
  }
});

async function executeSqlQuery() {
  const sqlServerConnector = document.getElementById("sqlServerConnector");
  const connectionDetails = getConnectionDetails();
  const dbConnectionContainer = document.getElementById(
    "dbConnectionContainer"
  );
  dbConnectionContainer.remove();
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;
  const query = activeEditor.getValue();

  try {
    const response = await fetch(
      `${sqlServerConnector.value}/execute-sql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...connectionDetails, query }),
      }
    );

    const data = await response.json();
    console.log("Response from /execute-sql:", data);

    if (data.error) {
      displaySqlResult(`Error: ${data.error}`);
    } else {
      displaySqlResult(JSON.stringify(data.results, null, 2));
    }
  } catch (error) {
    displaySqlResult(`Error: ${error.message}`);
  }
}

function getConnectionDetails() {
  return {
    host: document.getElementById("dbHost").value,
    user: document.getElementById("dbUser").value,
    password: document.getElementById("dbPassword").value,
    database: document.getElementById("dbName").value,
    port: document.getElementById("dbPort").value,
  };
}

function displaySqlResult(result) {
  const sqlResultContainer = document.getElementById("sqlResultContainer");
  sqlResultContainer.innerHTML = "<pre>" + result + "</pre>";
}

function createDatabaseForm() {
  const dbContainer = document.createElement("div");
  dbContainer.id = "dbConnectionContainer";

  const sqlServerConnectorInput = createInput(
    "sqlServerConnector",
    "text",
    "SQL Server Connector URL",
    "SQL Server Connector URL"
  );

  const dbHostInput = createInput(
    "dbHost",
    "text",
    "Database Host",
    "Database Host"
  );
  const dbUserInput = createInput(
    "dbUser",
    "text",
    "Database User",
    "Database User"
  );
  const dbPasswordInput = createInput(
    "dbPassword",
    "password",
    "Database Password",
    "Database Password"
  );
  const dbNameInput = createInput(
    "dbName",
    "text",
    "Database Name",
    "Database Name"
  );
  const dbPortInput = createInput("dbPort", "text", "0000", "Database Port");

  const runQueryButton = document.createElement("button");
  runQueryButton.textContent = "Run SQL Query";
  runQueryButton.onclick = executeSqlQuery;

  dbContainer.appendChild(sqlServerConnectorInput);
  dbContainer.appendChild(document.createElement("br"));
  dbContainer.appendChild(dbHostInput);
  dbContainer.appendChild(document.createElement("br"));
  dbContainer.appendChild(dbUserInput);
  dbContainer.appendChild(document.createElement("br"));
  dbContainer.appendChild(dbPasswordInput);
  dbContainer.appendChild(document.createElement("br"));
  dbContainer.appendChild(dbNameInput);
  dbContainer.appendChild(document.createElement("br"));
  dbContainer.appendChild(dbPortInput);
  dbContainer.appendChild(document.createElement("br"));
  dbContainer.appendChild(runQueryButton);

  document.body.appendChild(dbContainer);
}

function createInput(id, type, placeholder, label) {
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.placeholder = placeholder;
  input.setAttribute("aria-label", label);
  return input;
}

function sqlOutput() {
  var x = document.getElementById("sqlResultContainer");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function kubernetesOps() {
  const container = document.createElement("div");
  container.id = "kubernetesContainer";

  const namespaceInput = createInput(
    "namespace",
    "text",
    "Namespace",
    "Kubernetes Namespace"
  );
  const resourceTypeSelect = createSelect(
    "resourceType",
    ["pods", "services", "deployments"],
    "Resource Type"
  );
  const operationSelect = createSelect(
    "operation",
    ["get", "create", "delete"],
    "Operation"
  );
  const serverUrlInput = createInput(
    "serverUrlInput",
    "text",
    "http:localhost:3000",
    "Server Url"
  );

  const submitButton = document.createElement("button");
  submitButton.textContent = "Run Operation";
  submitButton.onclick = executeKubernetesOperation;

  container.appendChild(namespaceInput);
  container.appendChild(document.createElement("br"));
  container.appendChild(resourceTypeSelect);
  container.appendChild(document.createElement("br"));
  container.appendChild(operationSelect);
  container.appendChild(document.createElement("br"));
  container.appendChild(serverUrlInput);
  container.appendChild(document.createElement("br"));
  container.appendChild(submitButton);

  document.body.appendChild(container);
}

function createSelect(id, options, label) {
  const select = document.createElement("select");
  select.id = id;
  select.setAttribute("aria-label", label);
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
  return select;
}

async function executeKubernetesOperation() {
  const namespace = document.getElementById("namespace").value;
  const resourceType = document.getElementById("resourceType").value;
  const operation = document.getElementById("operation").value;
  const serverKubernetesUrl = document.getElementById("serverUrlInput").value;
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;
  const yaml = activeEditor.getValue();

  try {
    const response = await fetch(serverKubernetesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ namespace, resourceType, operation, yaml }),
    });

    const result = await response.json();
    displayKubernetesResult(JSON.stringify(result, null, 2));
  } catch (error) {
    displayKubernetesResult(`Error: ${error.message}`);
  }
}

function displayKubernetesResult(result) {
  const resultContainer =
    document.getElementById("kubernetesResultContainer") ||
    document.createElement("div");
  resultContainer.id = "kubernetesResultContainer";
  resultContainer.innerHTML = "<pre>" + result + "</pre>";
  document.body.appendChild(resultContainer);
}

async function executeDockerOperation() {
  const formContainer = document.getElementById('formContainer');
  formContainer.style.display = 'block';

  if (!formContainer) {
    console.error("Form container not found in the DOM.");
    return;
  }

  // Clear previous content
  formContainer.innerHTML = '';

  // Create the input and select elements dynamically inside the function
  const containerInput = createInput('containerInput', 'text', 'Enter container name', 'Container Input');
  const operationSelect = createSelect('operationSelect', ['start', 'stop', 'remove'], 'Operation Select');
  const imageInput = createInput('imageInput', 'text', 'Enter image name', 'Image Input');
  const dockerServerUrlInput = createInput('dockerServerUrl', 'text', 'http://localhost:6749/docker', 'Docker Server Url');

  // Append the elements to the form container
  formContainer.appendChild(containerInput);
  formContainer.appendChild(operationSelect);
  formContainer.appendChild(imageInput);
  formContainer.appendChild(dockerServerUrlInput);

  const submitButton = document.createElement('button');
  submitButton.id = 'submitButton';
  submitButton.textContent = 'Submit';
  formContainer.appendChild(submitButton);

  const resultContainer = document.createElement('div');
  resultContainer.id = 'resultContainer';
  formContainer.appendChild(resultContainer);

  // Event listener for the submit button
  submitButton.addEventListener('click', async () => {
    const operation = operationSelect.value;
    const container = containerInput.value;
    const image = imageInput.value;
    const dockerServerUrl = dockerServerUrlInput.value;

    try {
      const response = await fetch(dockerServerUrl, { // Adjusted to fetch from localhost
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation, container, image }),
      });

      const result = await response.json();
      displayResult(JSON.stringify(result, null, 2));
    } catch (error) {
      displayResult(`Error: ${error.message}`);
    }
  });

  function displayResult(output) {
    resultContainer.textContent = output;
  }
}

