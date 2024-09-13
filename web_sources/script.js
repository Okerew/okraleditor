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

  user = createInput("GitHub username:", "usernameInput", container);
  repo = createInput("Repository name:", "repoInput", container);

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

    if (item.type === 'Error') {
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
        activeEditor.gotoLine(
            item.loc.start.line,
            item.loc.start.column,
            true
        );
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
      if (language.includes("javascript") || language.includes("c_cpp") || language.includes("rust") || language.includes("python") || language.includes("golang") || language.includes("kotlin") || language.includes("jsx") || language.includes("markdown")) {
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

const callback = function(mutationsList, observer) {
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

let currentFilePath;
let remoteFileServerUrl;

function loadServerFiles() {
  const directoryPathInput = document.createElement("input");
  directoryPathInput.type = "text";
  directoryPathInput.placeholder = "Enter the directory path to load:";
  document.body.appendChild(directoryPathInput);

  const remoteServerUrlInput = document.createElement("input");
  remoteServerUrlInput.type = "text";
  remoteServerUrlInput.placeholder = "Enter the remote server url:";
  remoteServerUrlInput.value = "https://mango-separate-leotard.glitch.me/";
  document.body.appendChild(remoteServerUrlInput);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.addEventListener("click", async () => {
    const directoryPath = directoryPathInput.value;
    remoteFileServerUrl = remoteServerUrlInput.value;

    if (!directoryPath || !remoteFileServerUrl) {
      console.error("Directory path and/or remote server URL not provided.");
      return;
    }

    const container = document.createElement("div");
    container.id = "fileTreeContainer";

    try {
      await createFileTreeFromServer("", container, directoryPath);
      container.style.display = "block";

      // Remove the input fields and submit button
      directoryPathInput.remove();
      remoteServerUrlInput.remove();
      submitButton.remove();
    } catch (error) {
      console.error("Error loading files from server:", error);
      alert(
          "Error loading files from server. Please check the console for details."
      );
    }

    document.body.appendChild(container);
  });
  document.body.appendChild(submitButton);
}

async function createFileTreeFromServer(dirPath, parentNode, basePath) {
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
          currentFilePath = basePath + dirPath + "/" + itemName;
          openFileInEditor(fileContent, editorId, itemName);
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
  if (!currentFilePath) {
    console.error("No current file path");
    return;
  }

  try {
    const response = await fetch(
        `${remoteFileServerUrl}/execute-file?path=${encodeURIComponent(
            currentFilePath
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

async function saveRemoteActiveFile() {
  if (!currentFilePath) {
    console.error("No current file path");
    return;
  }

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
        path: currentFilePath,
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

function remoteFileTree() {
  var x = document.getElementById("remoteFileTree");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
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
        "https://sour-relic-railway.glitch.me/execute-sql",
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

  const dbHostInput = createInput2(
      "dbHost",
      "text",
      "Database Host",
      "Database Host"
  );
  const dbUserInput = createInput2(
      "dbUser",
      "text",
      "Database User",
      "Database User"
  );
  const dbPasswordInput = createInput2(
      "dbPassword",
      "password",
      "Database Password",
      "Database Password"
  );
  const dbNameInput = createInput2(
      "dbName",
      "text",
      "Database Name",
      "Database Name"
  );
  const dbPortInput = createInput2("dbPort", "text", "0000", "Database Port");

  const runQueryButton = document.createElement("button");
  runQueryButton.textContent = "Run SQL Query";
  runQueryButton.onclick = executeSqlQuery;

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

  const namespaceInput = createInput2("namespaceInput", "text", "Kubernetes Namespace", "Namespace");
  const resourceTypeSelect = createSelect("resourceTypeSelect", ["pods", "services", "deployments"], "Resource Type");
  const operationSelect = createSelect("operationSelect", ["get", "create", "delete"], "Operation");
  const serverUrlInput = createInput2("serverUrlInput", "text", "http://localhost:3000", "Server Url");

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
  options.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
  return select;
}

async function executeKubernetesOperation() {
  const namespace = document.getElementById("namespaceInput").value;
  const resourceType = document.getElementById("resourceTypeSelect").value;
  const operation = document.getElementById("operationSelect").value;
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
  const resultContainer = document.getElementById("kubernetesResultContainer") || document.createElement("div");
  resultContainer.id = "kubernetesResultContainer";
  resultContainer.innerHTML = "<pre>" + result + "</pre>";
  document.body.appendChild(resultContainer);
}

function terminal() {
  var x = document.getElementById("terminal");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function createInput(labelText, inputId, container) {
  var label = document.createElement("label");
  label.textContent = labelText;
  label.setAttribute("for", inputId);

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", inputId);
  input.setAttribute("name", inputId);

  container.appendChild(label);
  container.appendChild(input);

  // Add a line break for spacing (optional)
  container.appendChild(document.createElement("br"));
}

function createInput2(id, type, placeholder, label) {
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.placeholder = placeholder;
  input.setAttribute("aria-label", label);
  return input;
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
  const containerInput = createInput2('containerInput', 'text', 'Enter container name', 'Container Input');
  const operationSelect = createSelect('operationSelect', ['start', 'stop', 'remove'], 'Operation Select');
  const imageInput = createInput2('imageInput', 'text', 'Enter image name', 'Image Input');
  const dockerServerUrlInput = createInput2('dockerServerUrl', 'text', 'http://localhost:6749/docker', 'Docker Server Url');

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

function chatOps(){
  document.getElementById("chatbotModal").style.display = "block";
}

function hideChatOps(){
  document.getElementById("chatbotModal").style.display = "none";
}

async function executeHttpRequests() {
  const activeTab = document.querySelector(".tab.active");
  if (!activeTab) return;
  const editorId = activeTab.getAttribute("data-editor-id");
  const activeEditor = ace.edit(editorId);
  if (!activeEditor) return;

  const requestCode = activeEditor.getValue();

  // Function to send HTTP requests
  async function sendRequest(url, method = 'GET', body = null, headers = {}) {
    // Block requests to the config server
    if (url.includes('https://candle-cheerful-warlock.glitch.me')) {
      console.error('Request blocked: Access to this URL is not allowed');
      throw new Error('Access to this URL is not allowed');
    }

    try {
      const response = await fetch(url, { method, body, headers });
      const data = await response.json();
      console.log(`Response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`Error in request to ${url}:`, error.message);
      throw error;
    }
  }

  // Create and execute the function
  try {
    const executeRequests = new Function('sendRequest', `
      return async function() {
        ${requestCode}
      }
    `)(sendRequest);

    await executeRequests();
  } catch (error) {
    console.error("Error executing requests:", error.message);
  }
}
