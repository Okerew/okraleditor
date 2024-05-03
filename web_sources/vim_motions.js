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
    toggleTheme()
    toggleTheme()
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
  newTab.setAttribute("data-language", language);
  newEditor.setKeyboardHandler("ace/keyboard/vim");
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

setLanguageForActiveTab();

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
function executeJavaScriptCode() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");

  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const jsCode = activeEditor.getValue();

  const functionRegex = /function\s+([^\(]+)\(([^)]*)\)\s*{([^]*)}/g;

  let match;
  while ((match = functionRegex.exec(jsCode)) !== null) {
    const functionName = match[1];
    const functionParameters = match[2].split(',').map(param => param.trim());
    const functionBody = match[3];

    window[functionName] = new Function(...functionParameters, functionBody);
  }

  try {
    eval(jsCode);
  } catch (error) {
    console.error('Error executing JavaScript code:', error);
  }
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
function createInput(labelText, inputId, container) {
  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.id = inputId;
  input.type = "text";

  container.appendChild(label);
  container.appendChild(input);
}

async function loadRepoFiles() {
  const container = document.createElement("div");

  createInput("GitHub username:", "usernameInput", container);
  createInput("Repository name:", "repoInput", container);

  container.appendChild(document.createElement("br"));

  const submitButton = document.createElement("button");
  submitButton.textContent = "Load Repository Files";
  submitButton.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const repo = document.getElementById("repoInput").value.trim();

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

    container.style.display = "none";
  });

  container.appendChild(submitButton);

  document.body.appendChild(container);
}

function pushToGithub() {
  const container = document.createElement("div");

  createInput("GitHub username:", "usernameInput", container);
  createInput("Repository name:", "repoInput", container);
  createInput("GitHub token:", "tokenInput", container);
  createInput("Filename:", "filenameInput", container);
  createInput("Commit message:", "messageInput", container);
  createInput("Branch name:", "branchInput", container);

  container.appendChild(document.createElement("br"));

  const submitButton = document.createElement("button");
  submitButton.textContent = "Push Changes";
  submitButton.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const repo = document.getElementById("repoInput").value.trim();
    const token = document.getElementById("tokenInput").value.trim();
    const filename = document.getElementById("filenameInput").value.trim();
    const commitMessage = document.getElementById("messageInput").value.trim();
    const branchName = document.getElementById("branchInput").value.trim();

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
        throw new Error("Failed to push changes to the branch");
      }
      console.log("Changes pushed to branch successfully");
      alert("Changes pushed to branch successfully!");
    } catch (error) {
      console.error("Error pushing changes to branch:", error);
      alert(
        "Error pushing changes to branch. Please check the console for details."
      );
    } finally {
      container.style.display = "none";
    }
  });

  container.appendChild(submitButton);

  document.body.appendChild(container);

  container.style.display = "block";
}

function mergeBranches() {
  const container = document.createElement("div");

  createInput("GitHub username:", "usernameInput", container);
  createInput("Repository name:", "repoInput", container);
  createInput("Base branch:", "baseBranchInput", container);
  createInput("Head branch:", "headBranchInput", container);
  createInput("GitHub token:", "tokenInput", container);

  container.appendChild(document.createElement("br"));

  const submitButton = document.createElement("button");
  submitButton.textContent = "Merge Branches";
  submitButton.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const repo = document.getElementById("repoInput").value.trim();
    const baseBranch = document.getElementById("baseBranchInput").value.trim();
    const headBranch = document.getElementById("headBranchInput").value.trim();
    const token = document.getElementById("tokenInput").value.trim();

    const apiUrl = `https://api.github.com/repos/${username}/${repo}/merges`;

    const data = {
      base: baseBranch,
      head: headBranch,
      commit_message: "Merge branch",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to merge branches");
      }
      console.log("Branches merged successfully");
      alert("Branches merged successfully!");
    } catch (error) {
      console.error("Error merging branches:", error);
      alert("Error merging branches. Please check the console for details.");
    } finally {
      container.style.display = "none";
    }
  });

  container.appendChild(submitButton);

  document.body.appendChild(container);

  container.style.display = "block";
}

function fileTreeShow() {
  var x = document.getElementById("file-explorer");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
