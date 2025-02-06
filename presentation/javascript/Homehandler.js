import { Homepage, CreatPostTemp } from "./pages.js"
import { showError } from "./errore.js"
function HomeHandeler() {
    fetch('http://localhost:8080/getpost')
    .then(response => response.json())
    .then(data => {
        Homepage(data)
        let creatpost = document.querySelector(".create-post")
        creatpost.addEventListener("click", handelpost)
        let cancel = document.querySelector("#cancel")
        cancel.addEventListener("click", handelcontact)
        
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
        fetch('http://localhost:8080/pubpost', {
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


// const getSelectedCategories = () => {
//     const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
//     return Array.from(checkboxes).map(checkbox => checkbox.parentElement.textContent.trim());
// }
export { HomeHandeler }