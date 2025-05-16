import { QueryChat } from "./chat_servece.js"
import { LoadCaht ,MessageDate } from "../utils.js"
import {sendMessage} from "./websocket.js"


export const Contact = (data) => {
    
    let username = document.querySelector("title").getAttribute("class")
    let aside = document.querySelector(".contact-scroll")

    aside.innerHTML = ""

    if (data.length > 1) {
        data.forEach(element => {
            if (element.Nickname !== username) {
                let contact = document.createElement("div")
                contact.classList.add("contact-icon")
                
                contact.setAttribute("status", `${element.Type}`)

                contact.setAttribute("contact-id", `${element.Id}`)
                contact.setAttribute("nikname" , element.Nickname)
                contact.innerHTML = `
        <span class="material-icons" contact-ID="${element.Id}" nikname="${element.Nickname}" style="color: ${element.Type !== "online" ? "black" : "#10b981"}">account_circle</span><p>${element.Nickname}</p>
        `
                aside.append(contact)
                let span = contact.querySelector("span") 
                span.addEventListener("mouseover",event=>{
                     if (event.target.style.color=="black"){
                            event.target.style.cursor="not-allowed"
                        }
                })
                span.addEventListener("click" ,QueryChat )
            }
            
        });
    } else {
    
        let profile = document.createElement("p")
        profile.textContent = "Not a contact"
        profile.setAttribute("class", "notprofile")
        profile.style.marginLeft="40px"
        aside.append(profile)
    }



}


export const Chatemp = (data, name, id) => {
    
    let container = document.querySelector(".container")
    let chatContainer
    if (document.querySelector(".chat-container")) {
        chatContainer = document.querySelector(".chat-container")
    } else {
        chatContainer = document.createElement("div")
        chatContainer.classList.add("chat-container")
    }

    chatContainer.innerHTML = ` 
        <div class="chat-header">
        <span class="material-icons" id="back" style="cursor: pointer;">arrow_back</span>
        <span class="material-icons" style="margin-left: 30%">account_circle</span>
        ${name}
        </div>`
    container.append(chatContainer)
    let div = document.createElement("div")
    div.classList.add("chat-messages")
    div.setAttribute("data-name", name)
    if (data) {
        data.forEach(elem => {
            
            let msg = document.createElement("div")
            msg.classList.add("message")
            msg.setAttribute("msg_id",elem.Id)
            let nickname = document.createElement("div")
            if (elem.Sender === name) {
                nickname.innerHTML = `
                  <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
               <small> ${elem.Sender}</small>
               <small style="margin-left: 10%;">${MessageDate(elem.Time)}</small>
                `
            } else {
                msg.setAttribute("class", "sendr")
                nickname.innerHTML = `
                 <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
                 <small> ${elem.Sender}</small>
                 <small style="margin-left: 10%;">${MessageDate(elem.Time)}</small>
                `
            }

            nickname.style.display = "flex"
            let message = document.createElement("pre")
            message.className = "message-text";
            message.textContent = elem.Message
            msg.append(nickname)
            msg.append(message)
            div.append(msg)
        })


    } else {
        let msg = document.createElement("div")
        msg.style.textAlign = "center"
        msg.textContent = "Not a message available"
        div.append(msg)
    }

    chatContainer.append(div)
    chatContainer.innerHTML += `
  <div class="chat-input">
      <textarea  class="message-input" placeholder="Type a message..." required maxlength="1000"></textarea>
      <button>Send</button>
    </div>
    <div><small class="messageError" style="color:red ; display:none"></small></div>
    `

    chatContainer.style.display = "flex"
    container.append(chatContainer)
    let divchat = document.querySelector(".chat-input button")
    divchat.id = name
    divchat.setAttribute("data-id", id)

    document.getElementById("back").addEventListener("click", () => {
        chatContainer.style.display = "none"
    })

    let message_chate = document.querySelector(".chat-messages")



    message_chate.addEventListener("scroll", LoadCaht)
    divchat.addEventListener("click", sendMessage)

}


export const MoreMessage = (data) => {
    let div = document.querySelector(".chat-messages")
    let Senders = document.querySelectorAll(".sendr")
    let Resevers = document.querySelectorAll(".message")
    let name = div.getAttribute("data-name")
    let arr = []
Senders.forEach(el=>arr.push(el.getAttribute("msg_id")))
Resevers.forEach(el=>arr.push(el.getAttribute("msg_id")))
    if (data) {
        data.forEach(elem => {
            if (!arr.includes(String(elem.Id)) ){
            let msg = document.createElement("div")
            msg.classList.add("message")
            msg.setAttribute("msg_id",elem.Id)
            let nickname = document.createElement("div")
            if (elem.Sender === name) {
                nickname.innerHTML = `
                    <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
               <small> ${elem.Sender}</small>
               <small style="margin-left: 10%;">${MessageDate(elem.Time)}</small>
                    `
            } else {
                msg.setAttribute("class", "sendr")
                nickname.innerHTML = `
                     <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
                 <small> ${elem.Sender}</small>
                 <small style="margin-left: 10%;">${MessageDate(elem.Time)}</small>
                    `
            }
            let message = document.createElement("Pre")
            message.className = "message-text";
            message.textContent = elem.Message
            msg.append(nickname)
            msg.append(message)
            div.append(msg)
        }
        })

    }
}