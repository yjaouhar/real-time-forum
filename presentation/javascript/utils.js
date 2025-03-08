import { MoreData } from "./pages.js"
import { likeHandel, QuertMoreChat, QueryChat } from "./service.js"

export const pagenation = debounce(() => {
    if ((document.body.offsetHeight - (window.innerHeight + window.scrollY)) < 500) {
        fetch('/getpost')
            .then(response => response.json())
            .then(data => {
                if (data.finish) {
                    window.removeEventListener("scroll", pagenation)
                } else {
                    MoreData(data);
                    let reactionLike = document.querySelectorAll("#like")
                    reactionLike.forEach(elm => elm.addEventListener("click", likeHandel))
                    let reactionDisLike = document.querySelectorAll("#dislike")
                    reactionDisLike.forEach(elm => elm.addEventListener("click", likeHandel))
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }
}, 300)
export const LoadCaht = debounce((event) => {


    let message_chate = event.target
    if (Math.abs(-message_chate.scrollTop + message_chate.clientHeight - message_chate.scrollHeight) < 5) {
        document.createElement("div").getAttribute
        QuertMoreChat(message_chate.getAttribute("data-name"))
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
    // pastDate.setHours(pastDate.getHours())
    console.log("Date : ", typeof Date.now()); // 2025-02-06 17:41:25
    let now = new Date();
    let seconds = Math.floor((now - pastDate) / 1000); // Correction: now - pastDate

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


export const Users = (profile, Nickname) => {
    if (profile) {
        profile.addEventListener("click", (event) => {
            // document.getElementById("cancel").classList = "visibility_off"
            // document.querySelector("#contact").style.display="block"
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