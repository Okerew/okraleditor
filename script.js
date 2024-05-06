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
      maxLines: Infinity,
      minLines: 38,
    });

    newEditor.setValue(reader.result);

    const editorId = `editor-${Date.now()}`;
    newEditor.container.id = editorId;

    const extension = file.name.split(".").pop();
    newEditor.session.setMode(`ace/mode/${extension}`);
    newEditor.setKeyboardHandler("ace/keyboard/vim");

    newTab.setAttribute("data-editor-id", editorId);
    newEditor.container.style.width = "99%";
    newEditor.container.style.height = "600px";
    newEditor.container.style.border = "1px solid #ccc";
    newEditor.container.style.marginTop = "10px";
    newEditor.container.style.border = "2px solid #cccccc";
    newEditor.container.style.borderRadius = "5px";
    newEditor.container.style.fontSize = "15px";
    newEditor.container.style.fontFamily = "monospace";

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
  newEditor.container.style.fontSize = "15px";
  newEditor.container.style.fontFamily = "monospace";

  newEditor.container.id = editorId;

  const language = document.getElementById("language-select").value;
  newEditor.session.setMode(`ace/mode/${language}`);
  newEditor.setKeyboardHandler("ace/keyboard/vim");
  newTab.setAttribute("data-language", language);
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

setTimeout(function () {
  document.getElementById("hideDiv").style.display = "none";
}, 5000);

function toggleTheme(theme) {
  const currentTheme = editor.getTheme();
  const newTheme =
    currentTheme === "ace/theme/chrome"
      ? "ace/theme/monokai"
      : "ace/theme/chrome";

  const editorInstances = document.querySelectorAll(".ace_editor");
  for (const editorInstance of editorInstances) {
    const editor = ace.edit(editorInstance);
    editor.setTheme(newTheme);
  }

  const body = document.body;
  const isDarkTheme = newTheme === "ace/theme/monokai";
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

  // Sanitize HTML content
  const sanitizedHtml = DOMPurify.sanitize(htmlCode);

  const resultDiv = document.createElement("div");

  // Set sanitized HTML content
  resultDiv.innerHTML = sanitizedHtml;

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
  const sanitizedMarkdown = markdown.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  return sanitizedMarkdown
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

  const repoUrl = `https://api.github.com/repos/${username}/${repo}/contents`;

  try {
    const response = await fetch(repoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch repository contents");
    }
    const data = await response.json();

    for (const item of data) {
      if (item.type === "file") {
        const fileName = item.name;
        const fileUrl = item.download_url;

        const newTab = document.createElement("button");
        newTab.className = "tab";
        newTab.textContent = fileName;
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
        newEditor.container.style.fontSize = "15px";
        newEditor.container.style.fontFamily = "monospace";

        const fileContent = await fetch(fileUrl).then((response) =>
          response.text()
        );
        newEditor.setValue(fileContent);
        newEditor.setKeyboardHandler("ace/keyboard/vim");

        const editorId = `editor-${Date.now()}`;
        newEditor.container.id = editorId;
        newTab.setAttribute("data-editor-id", editorId);

        document.getElementById("tabBar").appendChild(newTab);
        document.body.appendChild(newEditor.container);
        toggleTheme();
        toggleTheme();
      }
    }
  } catch (error) {
    console.error("Error loading repository files:", error);
    alert(
      "Error loading repository files. Please check the console for details."
    );
  }
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

  const token = prompt("Enter your GitHub token:");
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

  const token = prompt("Enter your GitHub token:");
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

function saveToCookie() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const config = activeEditor.getValue();

  document.cookie = `config=${encodeURIComponent(config)}; path=/`;
}

function loadFromCookie() {
  const cookies = document.cookie.split(';');
  let config = null;

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('config=')) {
      config = decodeURIComponent(cookie.substring('config='.length));
      break;
    }
  }

  if (!config) return;

  const scriptTag = document.createElement("script");
  scriptTag.textContent = config;
  document.body.appendChild(scriptTag);
}

loadFromCookie();