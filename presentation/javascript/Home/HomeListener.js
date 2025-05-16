import {Homepage} from "./PageHome.js"
import {handelpost} from "./posteServecese.js"
import { send_comment , CommentEvent } from "./commentServece.js"
import {LogoutHandel} from "../Authontication/login-register.js"
import {Catlist ,CatHandel} from "./category.js"
import {pagenation} from "../utils.js"

export function HomeListener(data) {
  
    Homepage(data)
    let CreatPostBtn = document.querySelector(".create-post button")
    CreatPostBtn.addEventListener("click", handelpost)


    let sendcomment = document.querySelectorAll(".send-button")
    sendcomment.forEach((el) => {
        el.addEventListener("click", send_comment)
    })

    let comment = document.querySelectorAll("#comment")
    comment.forEach((el) => {
        el.addEventListener("click", CommentEvent)
    })
    let logout = document.querySelector("#logout")
    logout.addEventListener("click", LogoutHandel)

    let category = document.querySelector(".menu")
    category.addEventListener("click", Catlist)

    window.addEventListener("scroll", pagenation)
    let categories = document.querySelectorAll(".cat")
    categories.forEach(elem => { elem.addEventListener("click", CatHandel) })

    // let menu = document.querySelector(".menu")
    // menu.addEventListener("click", Menu)

}

