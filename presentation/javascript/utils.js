// import { handle } from "./Authontication/login-register.js"
import { MoreData } from "./Home/PageHome.js"
import { QueryChat ,QuertMoreChat} from "./Chat/chat_servece.js"
// import { Error } from "./err.js"

export const pagenation = debounce(() => {
    if ((document.body.offsetHeight - (window.innerHeight + window.scrollY)) < 500) {
        let post = document.querySelectorAll(".post")
        const formData = new FormData()
        formData.append("id",post[post.length-1].getAttribute("postid"))
        fetch('/getpost', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    if (data.StatusCode) {
                        Error(data.StatusCode, data.error)
                    } else if (data.token) {
                        Checkstuts()
                    } else if (data.finish) {
                        window.removeEventListener("scroll", pagenation)
                    } else {
                        
                        MoreData(data);
                        let reactionLike = document.querySelectorAll("#like")
                        reactionLike.forEach(elm => elm.addEventListener("click", likeHandel))
                        let reactionDisLike = document.querySelectorAll("#dislike")
                        reactionDisLike.forEach(elm => elm.addEventListener("click", likeHandel))
                    }
                }
            })
            .catch(error => {
                console.error(error);

            });
    }
}, 300)
export const LoadCaht = debounce((event) => {
    let message_chate = event.target
    if (Math.abs(-message_chate.scrollTop + message_chate.clientHeight - message_chate.scrollHeight) < 5) {
        let message_chate_childe = message_chate.querySelectorAll("div")
        let id = message_chate_childe[message_chate_childe.length-2].getAttribute("msg_id")
        QuertMoreChat(message_chate.getAttribute("data-name"),id)
    }
}, 100)


export function debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}




export const Dateformat = (timestamp) => {
    let pastDate = new Date(timestamp);
    let now = new Date();
    pastDate.setHours(pastDate.getHours()-1)
    let seconds = Math.floor((now - pastDate) / 1000);

    if (seconds < 60) {
        return `${seconds} s`;
    } else if (seconds < 3600) {
        return `${Math.floor((seconds / 60))} m`;
    } else if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)} h`;
    } else {
        return `${Math.floor(seconds / 86400)} j`;
    }
}

export const MessageDate = (time) => {
    let date = new Date(time)

    let y = String(date.getFullYear())
    let d = date.getDate()
    let month = date.getMonth()
    let h = date.getHours()
    let m = date.getMinutes()
    return month + "/" + d + "/" + y.slice(2) + " " + h + ":" + m
}
export const Users = (profile, Nickname) => {

    if (profile) {
        profile.addEventListener("click", (event) => {
            console.log("===============");
            
            let id = event.target.getAttribute("contact-id")
            QueryChat(id, Nickname)
        })
    }
}

export const Clear = (type, input) => {
    document.querySelectorAll(`${type}${input}`).forEach(el => {
        el.remove()
    })
}