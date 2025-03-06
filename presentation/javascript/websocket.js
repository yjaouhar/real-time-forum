import { Dateformat, Users } from "./utils.js";
import { QueryContact } from "./service.js";


let socket;

function connectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("!!!! WebSocket Already Connected", socket.readyState);
        return;
    }
    let tock = document.cookie.slice(13);
    socket = new WebSocket(`ws://localhost:8080/ws?token=${tock}`);
    socket.onmessage = (event) => {
        let receivedData = JSON.parse(event.data);
        if (receivedData.type === "user_status") {
            
            const id = receivedData.id
            const status = receivedData.status
            let prof = document.querySelector(`[contact-id="${id}"]`)
            if (prof) {
                if (status === "offline") {
                    prof.style.background = "#939393"
                } else {
                    prof.style.background = "#10b981"
                }
            }

        }else {
            let contact = document.querySelector("#contact")
            let user = contact.querySelector(`[contact-id="${receivedData.Id}"]`)
            contact.prepend(user)
            Users(user, receivedData.username)
            let chatBox = document.querySelector(".chat-messages");
            
            if (chatBox != null){
            if (chatBox.getAttribute("data-name") === receivedData.username) {

                let messageElement = document.createElement("div");
                messageElement.className = "message";
                let messageSender = document.createElement("div");
                messageSender.className = "message-sender";
                messageSender.innerHTML = ` <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
            <small> ${receivedData.username}</small>
            <small style="margin-left: 30%;">${Dateformat(new Date())}</small>`;
                messageSender.style.display = "flex"
                let messageText = document.createElement("p");
                messageText.className = "message-text";
                messageText.textContent = receivedData.text;

                messageElement.append(messageSender);
                messageElement.append(messageText);
                if (chatBox) {
                    chatBox.prepend(messageElement);
                }
            } else {
                alert(`« ${receivedData.username} »  send a message `)
            }
        }else{
            alert(`« ${receivedData.username} »  send a message `) 
        }
        }


    };


}

export function sendLogin() {
    connectWebSocket();

    let msgObject = {
        token: document.cookie.slice(13),
        username: "",
        message: "",
    };

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msgObject));
        console.log("Login Message Sent");
    } else {
        console.log("WebSocket Not Open");
    }
}


export function closee() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("WebSocket Closed for Logout");
    }
    document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function sendMessage(event) {
    let id = event.target.getAttribute("data-id");
    
    let name = event.target.id;
    let contact = document.querySelector("#contact")
    let user = contact.querySelector(`[contact-id="${id}"]`)
    contact.prepend(user)
    console.log("?????? user :", user, "????? name:", name);

    Users(user, name)
    let token = document.cookie.slice(13);
    let messageInput = document.querySelector(".message-input");
    let message = messageInput.value.trim().replaceAll("\n", "");
    if (message !== "") {
        let msgObject = {
            token: token,
            username: name,
            text: message,
        };
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msgObject));
            console.log("Message sent");
        } else {
            console.log("WebSocket not open. Reconnecting...");
            connectWebSocket();
        }

        let chatBox = document.querySelector(".chat-messages");
        if (chatBox.textContent === "Not a message available") {
            chatBox.innerHTML = ""
        }
        let username = document.querySelector("title").getAttribute("class");

        let messageElement = document.createElement("div");
        messageElement.className = "sendr";
        let messageSender = document.createElement("div");
        messageSender.className = "message-sender";
        messageSender.innerHTML = `<small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
                                       <small> ${username}</small>
                                       <small style="margin-left: 30%;">${Dateformat(new Date())}</small>`
        messageSender.style.display = "flex"
        let messageText = document.createElement("p");
        messageText.className = "message-text";
        messageText.textContent = message;
        messageElement.append(messageSender);
        messageElement.append(messageText);
        chatBox.prepend(messageElement);
        messageInput.value = "";
    }
}


connectWebSocket();
