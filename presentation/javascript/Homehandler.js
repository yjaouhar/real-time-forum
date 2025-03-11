import { HomeListener } from "./service.js";
import { handle } from "./login-register.js"
import { Error } from "./err.js"
import { pagenation } from "./utils.js"
let DATA;
function HomeHandeler() {
    const formData = new FormData();
    formData.append('lastdata', true)
    fetch('/getpost', { method: 'POST', body: formData })

        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            if(data.request) {
                alert(data.request)
            }else if (data.StatusCode) {
                Error(data.StatusCode, data.error)
            } else if (data.token) {
                handle()
            } else if (data.finish) {
                window.removeEventListener("scroll", pagenation)
                console.log(document.body);
                if (document.querySelector(".container")===null) {
                    HomeListener(data)
                }
               
            } else {
                DATA = data
                HomeListener(data)
            }
        })
        .catch(error => {
            console.error(error);
        });
}


export { HomeHandeler, DATA }