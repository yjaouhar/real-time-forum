import  { pagenation} from "../utils.js"
import {HomeHandeler} from "./Homehandler.js"
import {Error} from "../err.js"
import { showError } from "../errore.js"
import { Checkstuts } from "../check.js"


export const handelpost = (event) => {

    window.removeEventListener("scroll", pagenation)
    let creat_btn = event.target
    creat_btn.style.display = "none"
    let creatcontainer = document.querySelector(".form-container")
    let post = document.querySelectorAll(".post")
    let contact = document.querySelector(".contact-bar")
    contact.style.display="none"
    creatcontainer.style.display = "block"
    post.forEach(elm => elm.style.display = "none")
    let canele = document.querySelector("#close")
    canele.addEventListener("click", () => {
        creatcontainer.style.display = "none"
        post.forEach(elm => elm.style.display = "block")
        creat_btn.style.display = "inline"
        contact.style.display="block"

        window.addEventListener("scroll", pagenation)
    })
    let form = document.forms.creatpost
    
    form.addEventListener("submit", submitpost)


}


export const submitpost = (ev) => {
    ev.preventDefault();
    let title = ev.target.title.value.replaceAll("\n", "")
    let post = ev.target.content.value.replaceAll("\n", "")

    if (title.trim() === "" || post.trim() === "") {
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
            if (data) {
                if (data.StatusCode) {
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
            }
        })
        .catch(error => {
            console.error(error);

        });
}