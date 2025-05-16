import { HomeListener } from "./HomeListener.js";
import { Checkstuts} from "../check.js"
import { Error } from "../err.js"
import { pagenation } from "../utils.js"

function HomeHandeler() {

    const formData = new FormData();
    formData.append('lastdata', true)
    fetch('/getpost', { method: 'POST', body: formData })

        .then(response => response.json())
        .then(data => {
            
            if (data) {
                if (data.StatusCode) {
                    Error(data.StatusCode, data.error)
                } else if (data.token) {
                    Checkstuts()
                } else if (data.finish) {
                    window.removeEventListener("scroll", pagenation)
                    if (document.querySelector(".container") === null) {
                       
                        
                        HomeListener(data)
                    }

                } else {
                    HomeListener(data)
                }
            }


        })
        .catch(error => {
            console.error(error);
        });
}


export { HomeHandeler }