
import {Error} from "../err.js"
import {showError} from "../errore.js"
import { Checkstuts ,validateCategories } from "../check.js";
import { MoreData } from "./PageHome.js";
import { debounce , pagenation , Clear} from "../utils.js";
import { HomeHandeler } from "./Homehandler.js";
  

export const CatHandel = debounce((eve) => {
    eve.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    let categories = eve.target.value
    if (categories === "all") {
        Clear(".", "post")
        HomeHandeler()
        return
    }
    const formData = new FormData();
    formData.set("categories", categories)
    formData.append('lastdata', true)
    if (validateCategories(categories)) {
        fetch("/categories", { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    if (data.StatusCode) {
                        console.log("===> data" , data);
                        Error(data.StatusCode, data.error)
                    } else if (data.tocken == false) {
                        Checkstuts()
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
                }
            })
            .catch(error => {
                console.error(error);
            })
        const scrollHandel = debounce((event) => {
            event.preventDefault();
            if ((document.body.offsetHeight - (window.innerHeight + window.scrollY)) < 500) {
                let post = document.querySelectorAll(".post")
                
                formData.delete('lastdata')
                formData.append("id", post[post.length - 1].getAttribute("postid"))

                fetch('/categories', { method: "POST", body: formData })
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            if (data.finish) {
                                window.removeEventListener("scroll", scrollHandel)
                            } else if (data.StatusCode) {
                                Error(data.StatusCode, data.error)
                            } else {
                                MoreData(data);
                            }
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




export const Catlist = () => {
    let sid = document.querySelector(".sidebar")
    if (sid.getAttribute("visibility") == "off") {
        sid.style.display="block"
        sid.setAttribute("visibility","on")

    }else{
        sid.style.display="none"
        sid.setAttribute("visibility","off")
    }
    
}


export const CategoryPost = (data) => {
    let post = document.querySelectorAll(".post")
    post.forEach(element => {
        element.remove()
    });

    MoreData(data)
}