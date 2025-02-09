import { Homepage, Login, MoreData } from "./pages.js"
import { showError } from "./errore.js"
import { pagenation, Dateformat } from "./utils.js"
import  {HomeHandeler } from "./Homehandler.js"

export function HomeListener(data) {
    Homepage(data)
    let CreatPostBtn = document.querySelector(".create-post")
    CreatPostBtn.addEventListener("click", handelpost)
    let cancel = document.querySelector("#cancel")
    cancel.addEventListener("click", handelcontact)

    let sendcomment = document.querySelectorAll(".send-button")
    sendcomment.forEach((el) => {
        el.addEventListener("click", send_comment)
    })
    window.addEventListener("scroll", pagenation)
    let comment = document.querySelectorAll("#comment")
    comment.forEach((el) => {
        el.addEventListener("click", CommentEvent)
    })

    let reactionLike = document.querySelectorAll("#like")
    reactionLike.forEach(elm => elm.addEventListener("click", likeHandel))
    let reactionDisLike = document.querySelectorAll("#dislike")
    reactionDisLike.forEach(elm => elm.addEventListener("click", likeHandel))
}



const likeHandel = (event) => {
    let content_type = event.target.getAttribute("data-type")
    let content_id = event.target.getAttribute("data-id")
    let reaction_type = event.target.id
    console.log(reaction_type);
    
    fetch("/reactione", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_type: `${content_type}`, content_id: `${content_id}`, reaction_type: `${reaction_type}` })
    })
        .then(response => response.json())
        .then(data => {
            console.log( (data));
           
        })
        .catch(error => {
            console.log('Error:', error);
        });
}



export const handelpost = (event) => {/////////////////formulaire dyal create post
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
    let post = ev.target.content.value
    if (title === "" || post === "") {
        showError("Fill in all the fields")
    }
    const formData = new FormData(ev.target);
    fetch('/pubpost', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                HomeHandeler()
            } else {
                showError(data.error)
            }
        })
        .catch(error => {
            console.log('Error:', error);

        });
}



const handelcontact = () => {///cancel contact
    let cancel = document.querySelector("#cancel")
    if (cancel.textContent == "visibility_off") {
        let contact = document.querySelector("#contact")
        contact.style.display = "none"
        cancel.textContent = "visibility"
    } else {
        let contact = document.querySelector("#contact")
        contact.style.display = "flex"
        cancel.textContent = "visibility_off"
    }

}




const send_comment = (event) => {/////send comment
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

    console.log("da6l hna");
    fetch('/sendcomment', {
        method: 'POST',
        body: JSON.stringify({ content: content, post_id: post_id }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
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

                    // CommentEvent(simulatedEvent); // Jarrab t7aydo w chouf wach kaykhddm
                }
            } else if (data.status == false && typeof data.tock != "undefined") {
                console.log("mochkil f tocken");
                Login();
            } else {
                console.log("mochkil");
                showError(data.error);
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
};



function CommentEvent(event) {//////comment
    console.log(event.target);

    let post_id = event.target.getAttribute("posteid");
    let postDiv = document.querySelector(`[postid="${post_id}"]`);

    console.log(event.target.getAttribute("class"));

    if (event.target.getAttribute("class") == "of") {

        fetch("/getcomment", {
            method: 'POST',
            body: JSON.stringify({ post_id: post_id }),
        })
            .then(response => response.json())
            .then(data => {
                data.forEach((el) => {
                    let commentDiv = document.createElement("div");
                    commentDiv.classList.add("comment-content");


                    let userDiv = document.createElement("div");
                    userDiv.classList.add("user-name");
                    userDiv.textContent = el.Username; // Changeha b user dynamiquement

                    let commentP = document.createElement("p");
                    commentP.classList.add("comment-text");
                    commentP.textContent = el.Content; // Changeha b data dynamiquement


                    let actionsDiv = document.createElement("div");
                    actionsDiv.classList.add("comment-actions");

                    let likeBtn = document.createElement("span");
                    likeBtn.classList.add("material-icons");
                    likeBtn.id = "like"
                    likeBtn.setAttribute("data-type", "comment")
                    likeBtn.setAttribute("data-id", el.ID)
                    likeBtn.textContent = "thumb_up_off_alt";

                    let dislikeBtn = document.createElement("span");
                    dislikeBtn.classList.add("material-icons");
                    dislikeBtn.id = "like"
                    dislikeBtn.setAttribute("data-type", "comment")
                    dislikeBtn.setAttribute("data-id", el.ID)
                    dislikeBtn.textContent = "thumb_down_off_alt";

                    let timeSpan = document.createElement("span");
                    timeSpan.classList.add("timestamp");
                    timeSpan.textContent = Dateformat(el.CreatedAt);


                    actionsDiv.appendChild(likeBtn);
                    actionsDiv.appendChild(dislikeBtn);
                    actionsDiv.appendChild(timeSpan);

                    commentDiv.appendChild(userDiv);
                    commentDiv.appendChild(commentP);
                    commentDiv.appendChild(actionsDiv);

                    postDiv.appendChild(commentDiv);

                })
                event.target.classList.remove("of")
                event.target.classList.add("on")
            })
            .catch(error => {
                console.log('Error:', error);

            });


    } else {
        let comment = postDiv.querySelectorAll(".comment-content")
        comment.forEach((el) => {
            el.remove()
        })
        event.target.classList.remove("on")
        event.target.classList.add("of")
    }

}







