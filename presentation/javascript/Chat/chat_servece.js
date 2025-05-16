import { Error } from "../err.js"
import { Checkstuts } from "../check.js"
import { Contact, Chatemp ,MoreMessage } from "../Chat/chatTemp.js"
import { LoadCaht } from "../utils.js"



export const QueryContact = () => {
    fetch("/getcontact", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {

            if (data) {
                if (data.StatusCode) {
                    Error(data.StatusCode, data.error)
                } else if (data.token) {
                    Checkstuts()
                } else {
                    Contact(data)
                }
            }

        })
        .catch(error => {
            console.error("Error:", error);
        })
}

export const QueryChat = (event) => {
    console.log(event.target);
    if (event.target.style.color=="black"){
        event.target.style.cursor="not-allowed"
        Notif("thes user is not onlien","error")
        return
    }

    const id = event.target.getAttribute("contact-ID")
    const nickname = event.target.getAttribute("nikname")

    const formData = new FormData()
    formData.append("nickname", nickname)
    formData.append("token", document.cookie.slice(13))
    formData.append("first", true)
    formData.append("id", 0)
    fetch("/querychat", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.tocken == false) {
                Checkstuts()
            } else {
                if (data) {
                    if (data.StatusCode) {
                        Error(data.StatusCode, data.error)
                        return
                    } else if (data.NoData) {
                        Chatemp(null, nickname, id)
                    } else {
                        console.log(data);
                        
                        Chatemp(data, nickname, id)
                    }
                }
            }


        })
        .catch(error => {
            console.error(error);
        });
}

export const Notif = (message, type) => {
    const notification = document.querySelector(".notification")
    notification.style.display = "flex"
    const icone = document.getElementById("icon")
    const Message = document.querySelector(".notification-message")
    icone.textContent = type
    Message.textContent = message
    if (type === "error") {
        icone.style.color = "red"
    } else {
        icone.style.color = "green"
    }
    setTimeout(() => {
        notification.style.display = "none"
    }, 2000)


}

export const QuertMoreChat = (name,id) => {
    const formData = new FormData()
    formData.append("nickname", name)
    formData.append("token", document.cookie.slice(13))
    formData.append("first", false)
    formData.append("id" , id)
    fetch("/querychat", { method: "POST", body: formData })
        .then(response => response.json())
       
        .then(data => {
            if (data){
                if (data.tocken) {
                    Checkstuts()
                }else if (data.StatusCode) {
                    Error(data.StatusCode, data.error)
                }else{
                if (data.length < 10) {
                let chat_container = document.querySelector(".chat-messages")
                chat_container.removeEventListener("scroll", LoadCaht)
            }
            MoreMessage(data)
            }
        }
            
        })
        .catch(error => {
            console.error(error);
        });
}