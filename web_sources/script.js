const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");

const languageSelect = document.getElementById("language-select");

languageSelect.addEventListener("change", function () {
  const selectedLanguage = languageSelect.value;
  editor.session.setMode("ace/mode/" + selectedLanguage);
});

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
  newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
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

function createInput(labelText, inputId, container) {
  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.id = inputId;
  input.type = "text";

  container.appendChild(label);
  container.appendChild(input);
}

async function createGitFileTree(dirPath, parentNode, username, repo) {
  const repoUrl = `https://api.github.com/repos/${username}/${repo}/contents${dirPath}`;

  try {
    const response = await fetch(repoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch directory contents");
    }
    const data = await response.json();

    const ul = document.createElement('ul');

    for (const item of data) {
      const li = document.createElement('li');
      const itemName = item.name;

      if (item.type === "file") {
        const button = document.createElement('button');
        button.textContent = itemName;
        button.addEventListener('click', async () => {
          const fileUrl = item.download_url;
          const fileContent = await fetch(fileUrl).then((response) => response.text());
          const editorId = `editor-${Date.now()}`;
          openGitFolderFile(fileContent, editorId);
        });
        li.appendChild(button);
      } else if (item.type === "dir") {
        const button = document.createElement('button');
        button.textContent = itemName;
        button.classList.add('folder');
        button.addEventListener('click', async () => {
          if (li.classList.contains('expanded')) {
            li.classList.remove('expanded');
            // Collapse folder
            while (li.nextElementSibling) {
              ul.removeChild(li.nextElementSibling);
            }
          } else {
            li.classList.add('expanded');
            // Expand folder
            await createGitFileTree(`${dirPath}/${itemName}`, li, username, repo);
          }
        });
        li.appendChild(button);
      }

      ul.appendChild(li);
    }

    parentNode.appendChild(ul);
    toggleTheme()
    toggleTheme()
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
  newEditor.container.style.fontSize = "15px";
  newEditor.container.style.fontFamily = "monospace";

  newEditor.setValue(fileContent);
  newEditor.setKeyboardHandler(`ace/keyboard/${keyboard_mode}`);
  newEditor.container.id = editorId;
  newTab.setAttribute("data-editor-id", editorId);

  document.getElementById("tabBar").appendChild(newTab);
  document.body.appendChild(newEditor.container);
  switchToTab({target: newTab});
  toggleTheme();
  toggleTheme();
}

async function loadRepoFiles() {
  const container = document.createElement("div");
  container.id = "fileTreeContainer";

  createInput("GitHub username:", "usernameInput", container);
  createInput("Repository name:", "repoInput", container);

  container.appendChild(document.createElement("br"));

  const submitButton = document.createElement("button");
  submitButton.textContent = "Load Repository Files";
  submitButton.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const repo = document.getElementById("repoInput").value.trim();

    await createGitFileTree("", container, username, repo);

    container.style.display = "block";
  });

  container.appendChild(submitButton);

  document.body.appendChild(container);
}


function pushToGithub() {
  const container = document.createElement("div");

  createInput("GitHub username:", "usernameInput", container);
  createInput("Repository name:", "repoInput", container);
  createInput("Filename:", "filenameInput", container);
  createInput("Commit message:", "messageInput", container);
  createInput("Branch name:", "branchInput", container);

  container.appendChild(document.createElement("br"));

  const submitButton = document.createElement("button");
  submitButton.textContent = "Push Changes";
  submitButton.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const repo = document.getElementById("repoInput").value.trim();
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

  container.appendChild(document.createElement("br"));

  const submitButton = document.createElement("button");
  submitButton.textContent = "Merge Branches";
  submitButton.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const repo = document.getElementById("repoInput").value.trim();
    const baseBranch = document.getElementById("baseBranchInput").value.trim();
    const headBranch = document.getElementById("headBranchInput").value.trim();

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

function loadExtensions() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".js";

  input.onchange = function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var scriptContent = event.target.result;
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text = scriptContent;

      document.getElementsByTagName("head")[0].appendChild(script);
    };

    reader.readAsText(file);
  };

  input.click();
}

function hideFileTree() {
  const fileTreeContainer = document.getElementById("fileTreeContainer");
  if (fileTreeContainer.style.display === "block") {
    fileTreeContainer.style.display = "none";
  }
  else{
    fileTreeContainer.style.display = "block";
  }
}

if (typeof keyboard_mode == 'undefined') {
  keyboard_mode = null;
}

async function pushAllToGithub() {
  const container = document.createElement("div");

  createInput("GitHub username:", "usernameInput", container);
  createInput("Repository name:", "repoInput", container);
  createInput("Commit message:", "commitMessageInput", container);
  createInput("Branch name:", "branchNameInput", container);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  container.appendChild(submitButton);

  document.body.appendChild(container);

  await new Promise((resolve) => {
    submitButton.addEventListener("click", resolve);
  });

  const username = document.getElementById("usernameInput").value;
  const repo = document.getElementById("repoInput").value;
  const commitMessage = document.getElementById("commitMessageInput").value;
  const branchName = document.getElementById("branchNameInput").value;

  if (!username) {
    console.error("GitHub username not provided or invalid.");
    return;
  }
  if (!repo) {
    console.error("Invalid repository name provided.");
    return;
  }
  if (!commitMessage) {
    console.error("Commit message not provided.");
    return;
  }
  if (!branchName) {
    console.error("Branch name not provided or invalid.");
    return;
  }

  const editorInstances = document.querySelectorAll(".ace_editor");

  for (let i = 0; i < editorInstances.length; i++) {
    const editorInstance = editorInstances[i];
    createInput("File name: ", "tabInput", container)
    const tabName = document.getElementById("tabInput").value;
    if (!tabName) {
      console.error("File name not provided or invalid.");
      return;
    }
    const editorId = editorInstance.id;
    const editor = ace.edit(editorId);
    const code = editor.getValue();

    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(tabName)}`;

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
  const container = document.createElement("div");

  createInput("Enter the language (js - javascript, html, css):", "languageInput", container);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Beautify";
  container.appendChild(submitButton);

  document.body.appendChild(container);

  submitButton.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab) return;

    const editorId = activeTab.getAttribute("data-editor-id");
    const activeEditor = ace.edit(editorId);
    if (!activeEditor) return;

    const editorValue = activeEditor.getValue();
    const language = document.getElementById("languageInput").value;

    if (!language) {
      console.error("There was a mistake, please try again.");
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

    document.body.removeChild(container);
  });
}

function getServerUrl() {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.id = 'inputContainer';
    document.body.appendChild(container);

    const label = document.createElement('label');
    label.for = 'serverUrlInput';
    label.textContent = 'Please enter the collaborative server URL: ';
    container.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'serverUrlInput';
    input.placeholder = 'https://thin-sprout-cactus.glitch.me/';
    container.appendChild(input);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Connect';
    container.appendChild(submitButton);

    submitButton.addEventListener('click', () => {
      const url = input.value;
      if (url) {
        resolve(url);
        document.body.removeChild(container);
      } else {
        reject('Server URL is required to connect to the collaborative server.');
        document.body.removeChild(container);
      }
    });
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
          const activeTab = document.querySelector('.tab.active');
          if (!activeTab) return;

          const editorId = activeTab.getAttribute('data-editor-id');
          const activeEditor = ace.edit(editorId);
          if (!activeEditor) return;

          const editorValue = activeEditor.getValue();
          socket.emit('editorChange', editorValue);
        }

        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;

        const editorId = activeTab.getAttribute('data-editor-id');
        const activeEditor = ace.edit(editorId);
        const debouncedSendEditorValue = debounce(sendEditorValue, 1000);

        activeEditor.session.on('change', debouncedSendEditorValue);

        socket.on('updateEditor', (editorValue) => {
          const activeTab = document.querySelector('.tab.active');
          if (!activeTab) return;

          const editorId = activeTab.getAttribute('data-editor-id');
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
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    const fileName = activeTab.textContent.trim();
    const fileExtension = fileName.split('.').pop().toLowerCase();

    let imageSrc = '';
    switch (fileExtension) {
      case 'py':
        imageSrc = 'icons/python-icon.png';
        break;
      case 'js':
        imageSrc = 'icons/javascript-icon.png';
        break;
      case 'html':
        imageSrc = 'icons/html-icon.png';
        break;
      case 'css':
        imageSrc = 'icons/css-icon.png';
        break;
      case 'json':
        imageSrc = 'icons/json-icon.png';
        break;
      case 'md':
        imageSrc = 'icons/markdown-icon.png';
        break;
      case 'jsx':
        imageSrc = 'icons/jsx-icon.png';
        break;
      case 'php':
        imageSrc = 'icons/php-icon.png';
        break;
      case 'cpp':
        imageSrc = 'icons/cpp-icon.png';
        break;
      case 'c':
        imageSrc = 'icons/c-icon.png';
        break;
      case 'sql':
        imageSrc = 'icons/sql-icon.png';
        break;
      case 'dockerfile':
        imageSrc = 'icons/dockerfile-icon.png';
        break;
      case 'kt':
        imageSrc = 'icons/kotlin-icon.png';
        break;
      case 'go':
        imageSrc = 'icons/go-icon.png';
        break;
      case 'ruby':
        imageSrc = 'icons/ruby-icon.png';
        break;
      case 'rust':
        imageSrc = 'icons/rust-icon.png';
        break;
      case 'mysql':
        imageSrc = 'icons/mysql-icon.png';
        break;
      default:
        imageSrc = 'icons/default.png';
        break;
    }

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `${fileExtension} icon`;
    img.style.width = '16px';
    img.style.height = '16px';

    // Clear previous images
    const previousImg = activeTab.querySelector('img');
    if (previousImg) {
      previousImg.remove();
    }

    activeTab.appendChild(img);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        appendImageToTab();
      }
    });
  });

  const config = { attributes: true, subtree: true, attributeFilter: ['class'] };
  observer.observe(document, config);
});

function saveCodeSnippet() {
  const container = document.createElement('div');
  container.id = 'inputContainer';
  document.body.appendChild(container);

  const label = document.createElement('label');
  label.for = 'Code snippet name';
  label.textContent = 'Please enter the code snippet name: ';
  container.appendChild(label);

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'snippetInput';
  container.appendChild(input);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Save Code Snippet';
  container.appendChild(submitButton);
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;

  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const codeSnippet = activeEditor.getValue();

  submitButton.onclick = function () {
    const snippetName = document.getElementById("snippetInput").value;

    if (snippetName) {
      localStorage.setItem(snippetName, codeSnippet);
      alert(`Code snippet "${snippetName}" saved successfully!`);
    } else {
      alert("No name provided. Snippet not saved.");
    }
    container.remove();
  };
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
