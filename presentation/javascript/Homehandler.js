import { HomeListener } from "./service.js";
import { handle } from "./login-register.js"
import { Error } from "./err.js"
let DATA;
function HomeHandeler() {
    const formData = new FormData();
    formData.append('lastdata', true)
    fetch('/getpost', { method: 'POST', body: formData })

        .then(response => response.json())
        .then(data => {
            if (data.StatusCode) {
                Error(data.StatusCode, data.error)
            } else if (data.token) {
                handle()
            } else if (data.finish) {
                window.removeEventListener("scroll", pagenation)
            } else {
                DATA = data
                HomeListener(data)
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}


export { HomeHandeler, DATA }