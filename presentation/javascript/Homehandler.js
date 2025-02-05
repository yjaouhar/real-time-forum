import { Homepage ,CreatPostTemp} from "./pages.js"
function HomeHandeler(){
Homepage()
let creatpost = document.querySelector(".create-post")
creatpost.addEventListener("click",CreatPostTemp)

}

export {HomeHandeler}