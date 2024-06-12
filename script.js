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

  document
    .querySelectorAll(".tab.active")
    .forEach((tab) => tab.classList.remove("active"));

  tab.classList.add("active");

  document
    .querySelectorAll(".ace_editor")
    .forEach((editor) => (editor.style.display = "none"));

  const activeEditor = ace.edit(tab.getAttribute("data-editor-id"));
  activeEditor.container.style.display = "block";
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
}

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

  return noDataURIImages
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^#(.*?)(\n|$)/gm, "<h1>$1</h1>")
    .replace(/\n- (.*?)\n/g, "<ul><li>$1</li></ul>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
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
  )}; expires=${expirationDate.toUTCString()}; path=/;`;
  ("SameSite=None");

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

async function executePythonCode() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const editorValue = activeEditor.getValue();

  try {
    const response = await fetch(
      "https://viridian-scratch-relative.glitch.me/execute-python",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: editorValue }),
      }
    );

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error executing Python code:", error);
  }
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

function shareWorkspace() {
  // Get the state of all tabs
  const tabsState = [];
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    const editorId = tab.getAttribute("data-editor-id");
    const editor = ace.edit(editorId);
    tabsState.push({
      value: editor.getValue(),
    });
  });

  // Generate a unique URL with the state of all tabs
  const url = new URL(window.location.href);
  url.searchParams.set("state", JSON.stringify(tabsState));

  prompt("Your workspace", url.toString(), "_blank");
}

function restoreWorkspace() {
  const url = new URL(window.location.href);
  const state = url.searchParams.get("state");
  if (state) {
    const tabsState = JSON.parse(state);
    tabsState.forEach((tabState, index) => {
      const newTab = document.createElement("button");
      newTab.className = "tab";
      newTab.textContent = `Restored File ${index + 1}`;
      newTab.addEventListener("click", switchToTab);

      const newEditorContainer = document.createElement("div");
      newEditorContainer.style.width = "99%";
      newEditorContainer.style.height = "600px";
      newEditorContainer.style.border = "1px solid #ccc";
      newEditorContainer.style.marginTop = "10px";
      newEditorContainer.style.border = "2px solid #cccccc";
      newEditorContainer.style.borderRadius = "5px";
      newEditorContainer.style.fontSize = "15px";
      newEditorContainer.style.fontFamily = "monospace";

      const newEditor = ace.edit(newEditorContainer);
      newEditor.setOptions({
        maxLines: 38,
        minLines: 38,
      });

      newEditor.setValue(tabState.value);

      const editorId = `editor-${Date.now()}`;
      newEditor.container.id = editorId;
      newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
      newTab.setAttribute("data-editor-id", editorId);

      document.getElementById("tabBar").appendChild(newTab);
      document.body.appendChild(newEditorContainer);
      toggleTheme();
      toggleTheme();

      if (index === 0) {
        switchToTab({ target: newTab });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", restoreWorkspace);

async function executeCppCode() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const editorValue = activeEditor.getValue();

  try {
    const response = await fetch(
      "https://magical-daily-shallot.glitch.me/execute-cpp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: editorValue }),
      }
    );

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error executing C++ code:", error);
  }
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

function appendImageToTab() {
  const activeTab = document.querySelector(".tab.active");
  if (activeTab) {
    const fileName = activeTab.textContent.trim();
    const fileExtension = fileName.split(".").pop().toLowerCase();

    let imageSrc = "";
    switch (fileExtension) {
      case "py":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/python-icon.png?v=1718043792751";
        break;
      case "js":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/javascript-icon.png?v=1718043790844";
        break;
      case "html":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/html-icon.png?v=1718043786000";
        break;
      case "css":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/css-icon.png?v=1718043787317";
        break;
      case "json":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/json-icon.png?v=1718043776075";
        break;
      case "md":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/markdown-icon.png?v=1718043796183";
        break;
      case "jsx":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/jsx-icon.png?v=1718043816791";
        break;
      case "php":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/php-icon.png?v=1718044475075";
        break;
      case "cpp":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/cpp-icon.png?v=1718043827762";
        break;
      case "sql":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/sql-icon.png?v=1718043813734";
        break;
      case "dockerfile":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/docker-icon.png?v=1718043784184";
        break;
      case "mysql":
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/mysql-icon.png?v=1718043811298";
        break;
      default:
        imageSrc =
          "https://cdn.glitch.global/08dad197-ffa7-4cdd-b579-683ad1281936/default.png?v=1718043794435";
        break;
    }

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = `${fileExtension} icon`;
    img.style.width = "16px";
    img.style.height = "16px";

    // Clear previous images
    const previousImg = activeTab.querySelector("img");
    if (previousImg) {
      previousImg.remove();
    }

    activeTab.appendChild(img);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        appendImageToTab();
      }
    });
  });

  const config = {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  };
  observer.observe(document, config);
});

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
    let parsed;
    try {
      parsed = esprima.parseModule(editorValue, {
        jsx: true,
        tolerant: true,
        loc: true,
      });
    } catch (parseError) {
      console.error("Error parsing the editor content:", parseError);
      return; // Exit if parsing fails
    }

    const outline = [];

    function traverse(node, parent) {
      try {
        switch (node.type) {
          case "FunctionDeclaration":
            outline.push({
              type: "Function",
              name: node.id.name,
              loc: node.loc,
            });
            break;
          case "ClassDeclaration":
            outline.push({ type: "Class", name: node.id.name, loc: node.loc });
            break;
          case "VariableDeclaration":
            node.declarations.forEach((decl) => {
              outline.push({
                type: "Variable",
                name: decl.id.name,
                loc: node.loc,
              });
            });
            break;
          default:
            break;
        }

        for (let key in node) {
          if (node[key] && typeof node[key] === "object") {
            traverse(node[key], node);
          }
        }
      } catch (traverseError) {
        console.error("Error traversing the AST:", traverseError);
      }
    }

    traverse(parsed, null);

    const outlineElement = document.createElement("div");
    outlineElement.id = "projectOutline";

    outline.forEach((item) => {
      if (item.loc) {
        // Ensure item.loc is defined
        const itemElement = document.createElement("div");
        itemElement.classList.add("outline-item");
        itemElement.textContent = `${item.type}: ${item.name}`;
        itemElement.style.cursor = "pointer";
        itemElement.onclick = () => {
          activeEditor.scrollToLine(
            item.loc.start.line - 1,
            true,
            true,
            function () {}
          );
          activeEditor.gotoLine(
            item.loc.start.line,
            item.loc.start.column,
            true
          );
        };
        outlineElement.appendChild(itemElement);
      }
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
  } catch (error) {
    console.error("Error generating project outline:", error);
  }
}

const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

let activeTab = document.querySelector(".tab.active");

const callback = function (mutationsList, observer) {
  try {
    if (activeTab) {
      const editorId = activeTab.getAttribute("data-editor-id");
      const activeEditor = ace.edit(editorId);
      activeEditor.session.off("change", generateProjectOutline);
    }

    activeTab = document.querySelector(".tab.active");
    if (activeTab) {
      const editorId = activeTab.getAttribute("data-editor-id");
      const activeEditor = ace.edit(editorId);
      activeEditor.session.on("change", generateProjectOutline);
    }
  } catch (error) {
    console.error("Error in MutationObserver callback:", error);
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

if (activeTab) {
  try {
    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    activeEditor.session.on("change", generateProjectOutline);
  } catch (error) {
    console.error("Error attaching change event to initial editor:", error);
  }
}

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
