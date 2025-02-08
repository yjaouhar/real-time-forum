import { Homepage, CreatPostTemp, Login } from "./pages.js"
import { showError } from "./errore.js"
import { Dateformat } from "./check.js"
// let nb = 20
function HomeHandeler() {
    // const formData = new FormData();
    // formData.append('namber', nb)
    // { method: 'POST', body: formData }
    fetch('/getpost',)
        .then(response => response.json())
        .then(data => {
            Homepage(data)
            let creatpost = document.querySelector(".create-post")
            creatpost.addEventListener("click", handelpost)
            let cancel = document.querySelector("#cancel")
            cancel.addEventListener("click", handelcontact)

            let sendcomment = document.querySelectorAll(".send-button")
            sendcomment.forEach((el) => {
                el.addEventListener("click", send_comment)
            })


            let comment = document.querySelectorAll("#comment")
            comment.forEach((el) => {
                el.addEventListener("click", CommentEvent)
            })
            // nb += 10
        })
        .catch(error => {
            console.log('Error:', error);
        });




}

const handelpost = () => {
    CreatPostTemp()
    let canele = document.querySelector("#cancel")
    canele.addEventListener("click", HomeHandeler)
    let form = document.forms.creatpost
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let title = ev.target.title.value
        let post = ev.target.content.value
        if (title === "" || post === "") {
            showError("Fill in all the fields")
        }
        const formData = new FormData(form);
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
    })


}

const handelcontact = () => {
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
    let all = commentDiv.querySelectorAll(".comment-content");
    console.log(all,"================");

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

                let all = commentDiv.querySelectorAll(".comment-content");
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


function CommentEvent(event) {
    console.log(event.target);

    let post_id = event.target.getAttribute("posteid");
    let postDiv = document.querySelector(`[postid="${post_id}"]`);
    //  let comment = post.querySelector(".comment-section");

    console.log(event.target.getAttribute("class"));

    if (event.target.getAttribute("class") == "of") {

        fetch("/getcomment", {
            method: 'POST',
            body: JSON.stringify({ post_id: post_id }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // postDiv.textContent=`${data.lenght} 💬`;
                data.forEach((el) => {
                    let commentDiv = document.createElement("div");
                    commentDiv.classList.add("comment-content");


                    let userDiv = document.createElement("div");
                    userDiv.classList.add("user-name");
                    userDiv.textContent = el.Username; // Changeha b user dynamiquement

                    let commentP = document.createElement("p");
                    commentP.classList.add("comment-text");
                    commentP.textContent = el.Content; // Changeha b data dynamiquement

                    // Création de la section des actions
                    let actionsDiv = document.createElement("div");
                    actionsDiv.classList.add("comment-actions");

                    let likeBtn = document.createElement("button");
                    likeBtn.classList.add("action-btn");
                    likeBtn.textContent = "J'aime";

                    let replyBtn = document.createElement("button");
                    replyBtn.classList.add("action-btn");
                    replyBtn.textContent = "Répondre";

                    let timeSpan = document.createElement("span");
                    timeSpan.classList.add("timestamp");
                    timeSpan.textContent = Dateformat(el.CreatedAt); // Changeha dynamiquement ila bghiti

                    // Ajout des boutons et timestamp dans actionsDiv
                    actionsDiv.appendChild(likeBtn);
                    actionsDiv.appendChild(replyBtn);
                    actionsDiv.appendChild(timeSpan);

                    // Ajout des éléments dans commentDiv
                    commentDiv.appendChild(userDiv);
                    commentDiv.appendChild(commentP);
                    commentDiv.appendChild(actionsDiv);

                    // Ajout du commentaire dans le postDiv
                    postDiv.appendChild(commentDiv);

                })
                event.target.classList.remove("of")
                event.target.classList.add("on")
            })
            .catch(error => {
                console.log('Error:', error);

            });
       

    }else{
        let comment = postDiv.querySelectorAll(".comment-content")
        comment.forEach((el) => {
            el.remove()
        })
        event.target.classList.remove("on")
        event.target.classList.add("of")
    }

}

export { HomeHandeler }