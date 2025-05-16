import {Error} from "../err.js"
import {showError} from "../errore.js"
import {Dateformat , Clear} from "../utils.js"
import { Checkstuts } from "../check.js"

export const send_comment = (event) => {
    let wrapper = event.target.closest(".input-wrapper");
    if (!wrapper) {
        console.error("Mochkil: Makaynch .input-wrapper");
        return;
    }

    let textarea = wrapper.querySelector(".comment-input");
    let content = textarea.value.replaceAll("\n", "");
    let post_id = textarea.getAttribute("data-idpost");
    let postDiv = document.querySelector(`[postid="${post_id}"]`);

    let commentDiv = postDiv?.querySelector("#comment");
    if (!commentDiv) {
        console.error("Mochkil: Makaynch #comment f postDiv");
        return;
    }

    if (content.trim() === "") {
        textarea.style.border="solid 1px red"
        return;
    }
    textarea.style.border="solid 1px black"
    fetch('/sendcomment', {
        method: 'POST',
        body: JSON.stringify({ content: textarea.value, post_id: post_id }),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
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

                    }
                } else if (data.tocken == false) {

                    Checkstuts()


                } else if (data.StatusCode) {

                    Error(data.StatusCode, data.error)
                }
            }

        })
        .catch(error => {
            console.error(error);
        });
};


export function CommentEvent(event) {

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
                    if (data.tocken == false) {
                        Checkstuts()
                    } else if (data.StatusCode) {
                        Error(data.StatusCode, data.error)
                    } else {
                        let div = document.createElement("div")
                        div.style.maxHeight="430px"
                        div.style.overflowY="auto"
                        data.forEach((el) => {
                            let commentDiv = document.createElement("div");
                            commentDiv.classList.add("comment-content");


                            let userDiv = document.createElement("div");
                            userDiv.classList.add("user-name");
                            userDiv.textContent = el.Username;

                            let commentP = document.createElement("pre");
                            commentP.classList.add("comment-text");
                            commentP.textContent = el.Content;


                            let actionsDiv = document.createElement("div");
                            actionsDiv.classList.add("comment-actions");
                            let timeSpan = document.createElement("span");
                            timeSpan.classList.add("timestamp");
                            timeSpan.textContent = Dateformat(el.CreatedAt);

                            actionsDiv.append(timeSpan);

                            commentDiv.append(userDiv);
                            commentDiv.append(commentP);
                            commentDiv.append(actionsDiv);

                            div.append(commentDiv);

                        })
                        postDiv.append(div)
                        event.target.classList.remove("of")
                        event.target.classList.add("on")

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