let tock = document.cookie.slice(13)
console.log("==> tock hna :", tock);

const socket = new WebSocket(`ws://localhost:8080/ws?token=${tock}`);

function sendMessage(event) {
    let name = event.target.id;
  

    // let token = localStorage.getItem("SessionToken");
    let token = document.cookie.slice(13)
    console.log("==> token :", token);

    let messageInput = document.querySelector(".message-input");
    let message = messageInput.value.trim();
    message = message.replaceAll("\n", "")


    if (message !== "") {
        console.log("Sending:", message);
        let msgObject = {
            token: token,
            username: name,
            text: message,
        };

        // Verify WebSocket state before sending message
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msgObject));  // Send message if WebSocket is open
            console.log("Message sent");
        } else {
            console.log("WebSocket is not open. ReadyState:", socket.readyState);
        }
        let chatBox =  document.querySelector(".chat-messages");
        let messageElement = document.createElement("div");
        messageElement.className = "message";
        messageElement.setAttribute("class", "sendr");
        let messageSender = document.createElement("span");
        messageSender.className = "message-sender";
        messageSender.textContent = "ana";
        let messageText = document.createElement("p");
        messageText.className = "message-text";
        messageText.textContent = message;
        messageElement.appendChild(messageSender);
        messageElement.appendChild(messageText);
        chatBox.appendChild(messageElement);
        messageInput.value = "";
    }
}

socket.onmessage = (event) => {  // Ila server b3t message
    console.log("jak message");

    
    let receivedData = JSON.parse(event.data);
    console.log("Received:", receivedData);
        let chatBox = document.querySelector(".chat-messages");
        console.log(chatBox);
        let messageElement = document.createElement("div");
        messageElement.className = "message";
        let messageSender = document.createElement("span");
        messageSender.className = "message-sender";
        messageSender.textContent = receivedData.username;
        let messageText = document.createElement("p");
        messageText.className = "message-text";
        messageText.textContent = receivedData.text;
        messageElement.appendChild(messageSender);
        messageElement.appendChild(messageText);
        chatBox.appendChild(messageElement);
};

export { sendMessage };
