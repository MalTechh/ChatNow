const socket = io("ws://localhost:3000");

const username = "User";
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  const message = document.getElementById("mess").value;
  message.value = "";
  socket.emit("message", message);
});

socket.on("message", (message) => {
  const chatbox = document.getElementById("chat");
  const messageBox = document.createElement("div");
  const para = document.createElement("p");
  para.innerText = message;
  message.value = "";
  para.innerText += "\n" + "--" + username;
  messageBox.style.border = "outset";
  messageBox.style.minHeight = "40px";
  messageBox.style.display = "flex";
  messageBox.style.alignContent = "center";
  messageBox.appendChild(para);
  chatbox.appendChild(messageBox);
});
