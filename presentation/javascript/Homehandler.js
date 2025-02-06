import { Homepage ,CreatPostTemp} from "./pages.js"
function HomeHandeler(){
Homepage()
let creatpost = document.querySelector(".create-post")
console.log("===wwww===>");
creatpost.addEventListener("click",handelpost)

}

const handelpost = ()=>{
    CreatPostTemp()
}

export {HomeHandeler}