const socket = new WebSocket("ws://localhost:8080/ws");

function sendMessage(event) {
    let id = event.target.id;
    let name = event.target.getAttribute("class");
    
    let messageInput = document.querySelector(".message-input");
    let message = messageInput.value.trim();
    

    if (message !== "") {
        console.log("Sending:", message);

        // Convert message to JSON before sending
        let msgObject = {
            id : id,
            username: name,  // T9dar tbdlha b variable dial username
            text: message
        };

        // Verify WebSocket state before sending message
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msgObject));  // Send message if WebSocket is open
            console.log("Message sent");
        } else {
            console.log("WebSocket is not open. ReadyState:", socket.readyState);
            // Optionally, try to reconnect or notify user
        }

        // Clear input after sending
        messageInput.value = "";
    }
}

socket.onmessage = (event) => {  // Ila server b3t message
    console.log("jak message");
    // let receivedData = JSON.parse(event.data);
    // console.log(`${receivedData.username}: ${receivedData.text}`);
};

export { sendMessage };
