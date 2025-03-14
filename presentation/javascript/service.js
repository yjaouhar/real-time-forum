import { Homepage, Login, MoreData, Contact, Chatemp, MoreMessage, CategoryPost } from "./pages.js"
import { Checkstuts, validateCategories } from "./check.js"
import { showError } from "./errore.js"
import { Error } from "./err.js"
import { handle } from "./login-register.js"
import { pagenation, Dateformat, debounce, LoadCaht, Clear } from "./utils.js"
import { HomeHandeler, DATA } from "./Homehandler.js"


export function Listener() {
    let sendcomment = document.querySelectorAll(".send-button")
    sendcomment.forEach((el) => {
        el.addEventListener("click", send_comment)
    })
    let comment = document.querySelectorAll("#comment")
    comment.forEach((el) => {
        el.addEventListener("click", CommentEvent)
    })

}

export function HomeListener(data) {
    Homepage(data)
    let CreatPostBtn = document.querySelector(".create-post button")
    CreatPostBtn.addEventListener("click", handelpost)


    let sendcomment = document.querySelectorAll(".send-button")
    sendcomment.forEach((el) => {
        el.addEventListener("click", send_comment)
    })

    let logout = document.querySelector("#logout")
    logout.addEventListener("click", LogoutHandel)

    let category = document.getElementById("categor")
    category.addEventListener("click", Catlist)

    window.addEventListener("scroll", pagenation)
    let comment = document.querySelectorAll("#comment")
    comment.forEach((el) => {
        el.addEventListener("click", CommentEvent)
    })
    let categories = document.querySelectorAll(".cat")
    categories.forEach(elem => { elem.addEventListener("click", CatHandel) })

    let menu = document.querySelector(".menu")
    menu.addEventListener("click", Menu)

    let reactionLike = document.querySelectorAll("#like")
    reactionLike.forEach(elm => elm.addEventListener("click", likeHandel))
    let reactionDisLike = document.querySelectorAll("#dislike")
    reactionDisLike.forEach(elm => elm.addEventListener("click", likeHandel))
}

const CatHandel = debounce((eve) => {
    eve.preventDefault();
console.log("...........6666666.....",eve.target.value);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    let categories = eve.target.value
    if (categories === "all") {
        Clear(".", "post")
        MoreData(DATA)
        return
    }
    const formData = new FormData();
    formData.set("categories", categories)
    formData.append('lastdata', true)
    if (validateCategories(categories)) {
        fetch("/categories", { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.request) {
                    alert(data.request)
                } else if (data.StatusCode) {
                    Error(data.StatusCode, data.error)
                } else if (data.tocken == false) {
                    handle()
                } else if (data.NoData) {
                    Clear(".", "post")
                    MoreData(data)
                } else {
                    CategoryPost(data)
                }
                window.removeEventListener("scroll", pagenation);
                if (data.length == 10) {
                    window.addEventListener("scroll", scrollHandel)
                }
            })
            .catch(error => {
                console.error(error);
            })
        const scrollHandel = debounce((event) => {
            event.preventDefault();
            if ((document.body.offsetHeight - (window.innerHeight + window.scrollY)) < 500) {
                formData.delete('lastdata')
                fetch('/categories', { method: "POST", body: formData })
                    .then(response => response.json())
                    .then(data => {
                        if (data.request) {
                            alert(data.request)
                        } else if (data.finish) {
                            window.removeEventListener("scroll", scrollHandel)
                        } else if (data.StatusCode) {
                            Error(data.StatusCode, data.error)
                        } else {
                            MoreData(data);
                            let reactionLike = document.querySelectorAll("#like")
                            reactionLike.forEach(elm => elm.addEventListener("click", likeHandel))
                            let reactionDisLike = document.querySelectorAll("#dislike")
                            reactionDisLike.forEach(elm => elm.addEventListener("click", likeHandel))
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }, 100)

    } else {
        Error(400, "Bad Request")
    }
}, 100)



export const likeHandel = (event) => {
    let content_type = event.target.getAttribute("data-type")
    let content_id = event.target.getAttribute("data-id")
    let reaction_type = event.target.id
    let status = event.target.getAttribute("data-status")
    let id = event.target.id



    fetch("/reactione", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_type: `${content_type}`, content_id: `${content_id}`, reaction_type: `${reaction_type}` })
    })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.tocken == false) {
                Checkstuts()
            } else if (data.StatusCode) {
                Error(data.StatusCode, data.error)

            } else {

                let element
                if (reaction_type == "like") {
                    element = document.querySelector(`#dislike[data-id="${content_id}"]`)
                } else {
                    element = document.querySelector(`#like[data-id="${content_id}"]`)
                }
                if (status == "of" && element.getAttribute("data-status") == "of" && data.content_type !== "") {
                    event.target.setAttribute("data-status", "on")
                    event.target.parentNode.setAttribute("data-status", "on")
                    console.log("of on", data[id]);

                    event.target.parentNode.querySelector("b").textContent = data[id]
                } else if (status == "on" && element.getAttribute("data-status") == "of" && data.content_type == "") {
                    event.target.setAttribute("data-status", "of")
                    event.target.parentNode.setAttribute("data-status", "of")
                    event.target.parentNode.querySelector("b").textContent = data[id]
                } else if (status == "of" && element.getAttribute("data-status") == "on") {
                    event.target.setAttribute("data-status", "on")
                    event.target.parentNode.setAttribute("data-status", "on")
                    element.setAttribute("data-status", "of")
                    element.parentNode.setAttribute("data-status", "of")
                    event.target.parentNode.querySelector("b").textContent = data[id]
                    let elementid = element.id
                    element.parentNode.querySelector("b").textContent = data[elementid]
                }
            }

        })
        .catch(error => {
            console.error(error);
        });

}



export const handelpost = (event) => {
    window.removeEventListener("scroll", pagenation)
    let creat_btn = event.target
    creat_btn.style.display = "none"
    let creatcontainer = document.querySelector(".form-container")
    let post = document.querySelectorAll(".post")
    creatcontainer.style.display = "block"
    post.forEach(elm => elm.style.display = "none")
    let canele = document.querySelector("#close")
    canele.addEventListener("click", () => {
        creatcontainer.style.display = "none"
        post.forEach(elm => elm.style.display = "block")
        creat_btn.style.display = "inline"

        window.addEventListener("scroll", pagenation)
    })
    let form = document.forms.creatpost
    form.addEventListener("submit", submitpost)


}


export const submitpost = (ev) => {/////////////////formulaire dyal create post
    ev.preventDefault();
    let title = ev.target.title.value
    let post = ev.target.content.value.replaceAll("\n", "")

    if (title === "" || post.trim() === "") {
        showError("Fill in all the fields")
        return
    }
    const formData = new FormData(ev.target);
    fetch('/pubpost', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.StatusCode) {
                Error(data.StatusCode, data.error)
            } else if (data.tocken == false) {
                Checkstuts()
                return
            } else if (data.filldata) {
                showError("Fill all the field")
                return
            } else {
                HomeHandeler()
                return
            }
        })
        .catch(error => {
            console.error(error);

        });
}

const Menu = () => {
    let cancel = document.querySelector(".menu")
    if (cancel.getAttribute("data-vis") == "visibility_off") {
        let sid = document.querySelector(".sidebar")
        sid.style.display = "none"
        cancel.setAttribute("data-vis", "visibility")
    } else {
        let sid = document.querySelector(".sidebar")
        sid.style.display = "block"
        cancel.setAttribute("data-vis", "visibility_off")
    }
}


export const handelcontact = () => {///cancel contact
    let sid = document.querySelector("aside")
    let cancel = document.querySelector("#cancel")
    let cat = document.querySelector("#categor")
// let wid = sid.style.width
    if (cat.classList == "visibility_off") {
        let contact = document.querySelector(".category-list")
        contact.style.display = "none"
        cat.classList = "visibility"
        // sid.style.width = "70px"
        // sid.style.height = "fit-content"
    }
    if (cancel.classList == "visibility_off") {
        let contact = document.querySelector("#contact")
        // document.querySelector(".contact-container").style.display = "none"
        contact.style.display = "none"
        cancel.classList = "visibility"
        // sid.style.width = "6%"
        // sid.style.height = "fit-content"
    } else {
        let contact = document.querySelector("#contact")
        // document.querySelector(".contact-container").style.display = "block"
        contact.style.display = "block"
        cancel.classList = "visibility_off"
        // sid.style.width = wid
        // sid.style.height = "470px"

    }

}
export const Catlist = () => {

   
    let cnt = document.querySelector("#cancel")
    let cancel = document.querySelector("#categor")
    let sid = document.querySelector("aside")

    if (cnt.classList == "visibility_off") {
        let contact = document.querySelector("#contact")
        // document.querySelector(".contact-container").style.display = "none"
        contact.style.display = "none"
        cnt.classList = "visibility"
     
    }
    if (cancel.classList == "visibility_off") {
        let contact = document.querySelector(".category-list")
        contact.style.display = "none"
        cancel.classList = "visibility"
        // sid.style.width = "70px"
        // sid.style.height = "fit-content"
    } else {
        let contact = document.querySelector(".category-list")
        contact.style.display = "block"
        cancel.classList = "visibility_off"
        // sid.style.width = "270px"
        // sid.style.height = "470px"
    }

}




const send_comment = (event) => {
    let wrapper = event.target.closest(".input-wrapper");
    if (!wrapper) {
        console.error("Mochkil: Makaynch .input-wrapper");
        return;
    }

    let textarea = wrapper.querySelector(".comment-input");
    let content = textarea.value;
    let post_id = textarea.getAttribute("data-idpost");
    let postDiv = document.querySelector(`[postid="${post_id}"]`);

    let commentDiv = postDiv?.querySelector("#comment");
    if (!commentDiv) {
        console.error("Mochkil: Makaynch #comment f postDiv");
        return;
    }

    if (content === "") {
        showError("Fill in all the fields");
        return;
    }

    fetch('/sendcomment', {
        method: 'POST',
        body: JSON.stringify({ content: content, post_id: post_id }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.status) {
                let currentNb = parseInt(commentDiv.textContent, 10);
                if (isNaN(currentNb)) currentNb = 0;
                let nb = String(currentNb + 1);
                commentDiv.textContent = `${nb} 💬`;

                textarea.value = "";

                if (commentDiv.classList.contains("on")) {
                    commentDiv.classList.remove("on");
                    commentDiv.classList.add("of");
                    let all = postDiv.querySelectorAll(".comment-content");
                    all.forEach((el) => {
                        el.remove();
                    });

                    let simulatedEvent = new Event('click', { bubbles: true });
                    commentDiv.dispatchEvent(simulatedEvent);

                }
            } else if (data.tocken == false) {
                handle()
            } else if (data.StatusCode) {
                Error(data.StatusCode, data.error)
            }

        })
        .catch(error => {
            console.error(error);
        });
};



function CommentEvent(event) {

    let post_id = event.target.getAttribute("posteid");
    let postDiv = document.querySelector(`[postid="${post_id}"]`);
    if (event.target.getAttribute("class") == "of") {

        fetch("/getcomment", {
            method: 'POST',
            body: JSON.stringify({ post_id: post_id }),
        })
            .then(response => response.json())
            .then(data => {

                if (data) {
                    if (data.request) {
                        alert(data.request)
                    } else if (data.token == false) {
                        Checkstuts()
                    } else if (data.StatusCode) {
                        Error(data.StatusCode, data.error)
                    } else {
                        data.forEach((el) => {
                            let commentDiv = document.createElement("div");
                            commentDiv.classList.add("comment-content");


                            let userDiv = document.createElement("div");
                            userDiv.classList.add("user-name");
                            userDiv.textContent = el.Username;

                            let commentP = document.createElement("p");
                            commentP.classList.add("comment-text");
                            commentP.textContent = el.Content;


                            let actionsDiv = document.createElement("div");
                            actionsDiv.classList.add("comment-actions");
                            actionsDiv.innerHTML = `
                            <div class="like-button" data-status="of">
                                 <span id="like" data-type="comment" data-status="of" data-id = ${el.ID}  class="material-icons">thumb_up_off_alt</span> <b>${el.Like}</b>
                             </div>
                             <div class="like-button" data-status="of">
                                 <span id="dislike" data-type="comment" data-status="of" data-id = ${el.ID} class="material-icons">thumb_down_off_alt</span>  <b>${el.DisLike}</b>
                             </div>
                            `
                            if (el.Have === "like") {
                                let like = actionsDiv.querySelector("#like")
                                like.setAttribute("data-status", "on")
                                like.parentNode.setAttribute("data-status", "on")
                            } else if (el.Have === "dislike") {
                                let dislike = actionsDiv.querySelector("#dislike")
                                dislike.setAttribute("data-status", "on")
                                dislike.parentNode.setAttribute("data-status", "on")
                            }

                            let timeSpan = document.createElement("span");
                            timeSpan.classList.add("timestamp");
                            timeSpan.textContent = Dateformat(el.CreatedAt);

                            actionsDiv.append(timeSpan);

                            commentDiv.append(userDiv);
                            commentDiv.append(commentP);
                            commentDiv.append(actionsDiv);

                            postDiv.append(commentDiv);

                        })
                        event.target.classList.remove("of")
                        event.target.classList.add("on")
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


    } else {
        Clear(".", "comment-content")
        event.target.classList.remove("on")
        event.target.classList.add("of")
    }

}


export function LogoutHandel() {
    fetch("/logout", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.status == true) {
                document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                Checkstuts()
            }
        })
        .catch(error => {
            console.error(error);
        });
}


export const QueryChat = (id, nickname) => {
    const formData = new FormData()
    formData.append("nickname", nickname)
    formData.append("token", document.cookie.slice(13))
    formData.append("first", true)
    fetch("/querychat", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.StatusCode) {
                Error(data.StatusCode, data.error)
                return
            } else if (data.token) {
                handle()
            } else if (data.NoData) {
                Chatemp(null, nickname, id)
            } else {
                Chatemp(data, nickname, id)
            }

        })
        .catch(error => {
            console.error(error);
        });
}

export const QuertMoreChat = (name) => {
    const formData = new FormData()
    formData.append("nickname", name)
    formData.append("token", document.cookie.slice(13))
    formData.append("first", false)
    fetch("/querychat", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.length < 10) {
                let chat_container = document.querySelector(".chat-messages")
                chat_container.removeEventListener("scroll", LoadCaht)
            }
            MoreMessage(data)
        })
        .catch(error => {
            console.error(error);
        });
}

export const QueryContact = () => {
    fetch("/getcontact", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            if (data.request) {
                alert(data.request)
            } else if (data.StatusCode) {
                Error(data.StatusCode, data.error)
            } else if (data.token) {
                handle()
            } else {
                Contact(data)
                let cancel = document.querySelector("#cancel")
                cancel.addEventListener("click", handelcontact)
            }
        })
        .catch(error => {
            console.error("Error:", error);
        })
}

