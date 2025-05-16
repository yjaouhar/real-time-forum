import { Dateformat, Users, MessageDate, debounce } from "../utils.js";
import { QueryContact } from "./chat_servece.js";
import { Notif } from "./chat_servece.js";
import { Error } from "../err.js";

let socket;

export function connectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("!!!! WebSocket Already Connected", socket.readyState);
        return;
    }
    let tock = document.cookie.slice(13);
    socket = new WebSocket(`ws://localhost:8080/ws?token=${tock}`);

    socket.onmessage = (event) => {
        let receivedData = JSON.parse(event.data);
        if (receivedData.error) {
            let err = document.querySelector(".messageError")
            err.textContent = "Message too long! Max allowed is 2000 characters."
            err.style.display = "block"
            return
        }
        if (receivedData.type === "user_status") {
            const id = receivedData.id
            const status = receivedData.status
            let container = document.querySelector(".contact-scroll")

            let prof = container.querySelector(`[contact-id="${id}"]`)
            let icon = prof.querySelector("span")
            if (prof) {
                if (status === "offline") {
                    icon.style.color = "black"
                    icon.style.cursor="not-allowed"
                    if (document.querySelector(`[data-id="${id}"]`)) {
                        document.querySelector(".chat-container").style.display = "none"
                    }

                } else {
                    icon.style.cursor="pointer"
                    icon.style.color = "#10b981"
                }
            }

        } else if (receivedData.type === "new_contact") {
            QueryContact()

        } else {
            let contact = document.querySelector(".contact-scroll")
            let user = contact.querySelector(`[contact-id="${receivedData.Id}"]`)
            contact.prepend(user)
            Users(user, receivedData.username)
            let chatBox = document.querySelector(".chat-messages");

            let chatcontenier = document.querySelector(".chat-container")


            if ((chatcontenier != null && chatcontenier.style.display !== "none")) {
                if (chatBox.textContent === "Not a message available") {
                    chatBox.innerHTML = ""
                }
                if (chatBox.getAttribute("data-name") === receivedData.username) {
                    let messageElement = document.createElement("div");
                    messageElement.className = "message";
                    let messageSender = document.createElement("div");
                    messageSender.className = "message-sender";
                    messageSender.innerHTML = ` <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
            <small> ${receivedData.username}</small>
            <small style="margin-left: 10%;">${MessageDate(new Date())}</small>`;
                    messageSender.style.display = "flex"
                    let messageText = document.createElement("pre");
                    messageText.className = "message-text";
                    messageText.textContent = receivedData.text;

                    messageElement.append(messageSender);
                    messageElement.append(messageText);
                    if (chatBox) {
                        chatBox.prepend(messageElement);
                    }
                } else {
                    Notif(`« ${receivedData.username} »  send a message `, "notifications")
                }
            } else {
                Notif(`« ${receivedData.username} »  send a message `, "notifications")
            }

        }


    };

    socket.onerror = (error) => {
        console.log(error);
    }


}

export function sendLogin() {
    connectWebSocket();
    let msgObject = {
        token: document.cookie.slice(13),
        username: "",
        message: "",
    };

    Send(msgObject)
}


function Send(msgObject) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msgObject));
        console.log("Login Message Sent");
    } else {
        console.log("WebSocket Not Opennnnnnn");
    }
}

export function closee() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("WebSocket Closed for Logout");
    }
    document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const sendMessage = debounce((event) => {
    let id = event.target.getAttribute("data-id");
    let name = event.target.id;
    let contact = document.querySelector(".contact-scroll")
    let user = contact.querySelector(`[contact-id="${id}"]`)


    contact.prepend(user)
    Users(user, name)
    let token = document.cookie.slice(13);
    let messageInput = document.querySelector(".message-input");
    let message = messageInput.value
    let messagetest = messageInput.value.trim().replaceAll("\n", "");
    if (messagetest === "" ) {
        let err = document.querySelector(".messageError")
        err.textContent = "Message is empty, write something"
        err.style.display = "block"
        return
    } else if (message.length > 1000) {
        let err = document.querySelector(".messageError")
        err.textContent = "Message too long! Max allowed is 1000 characters."
        err.style.display = "block"
        return
    } else {
        document.querySelector(".messageError").style.display = "none"
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
                                           <small style="margin-left: 10%;">${MessageDate(new Date())}</small>`
        messageSender.style.display = "flex"
        let messageText = document.createElement("pre");
        messageText.className = "message-text";
        messageText.textContent = message;
        messageElement.append(messageSender);
        messageElement.append(messageText);
        chatBox.prepend(messageElement);
        messageInput.value = "";
    }



}, 100)
connectWebSocket();
