const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("chatbot-user-input");
const sendButton = document.getElementById("chatbot-send-button");
const chatBotUrl = document.getElementById("chatbot-url");

function addMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = `${
    sender === "user" ? "You" : "ChatBot"
  }: ${message}`;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, "user");
    userInput.value = "";
    let chatbot_url = chatBotUrl.value;
    try {
      const response = await fetch(chatbot_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          addMessage(`Error: ${data.error}`, "bot");
        } else if (data.response) {
          addMessage(data.response, "bot");
        } else {
          addMessage("Error: Unexpected response format", "bot");
        }
      } else {
        addMessage(`Error: ${response.status} ${response.statusText}`, "bot");
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage("Error: Unable to connect to the server", "bot");
    }
  }
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
