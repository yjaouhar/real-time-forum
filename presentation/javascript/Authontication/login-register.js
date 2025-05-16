import { Login , Regester} from "./login-regester_Page.js"
import { showError } from "../errore.js"
import { Error } from "../err.js"
// import { connectWebSocket } from "./websocket.js"
import { Checkemail, validateAge, validateGender, validateName, validatePassword, Checkstuts, validateNickname } from "../check.js"
document.addEventListener("DOMContentLoaded", Checkstuts)


export function handle() {

    
    Login()
    let creat_account = document.getElementById("resgesterlogin")
    let login_form = document.getElementById("login-form")

    login_form.addEventListener("submit", loginHandel)
    creat_account.addEventListener("click", CreatAccounte)

    function loginHandel(event) {
        event.preventDefault()
        const formData = new FormData(login_form);

        fetch('/login', {
            method: 'POST',
            body: formData

        })
            .then(response => response.json())
            .then(data => {
                if (data) {

                    if (data.StatusCode) {
                        Error(data.StatusCode, data.error)
                    } else if (data.status) {
                        Checkstuts(event)
                    } else {
                        showError(data.error)
                    }
                }
            })
            .catch(error => {
                console.error(error);

            });
    }

    function CreatAccounte(event) {
        // connectWebSocket()
        Regester()
        let login = document.getElementById("log")
        login.addEventListener("click", handle)
        let regester_form = document.getElementById("register-form")
        regester_form.addEventListener("submit", handleRegister)

    }

    function handleRegister(ev) {
        ev.preventDefault();
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let age = document.getElementById("age").value;
        let gender = document.getElementById("gender").value;
        let nickname = document.getElementById("nickname").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if (validateNickname(nickname) && validateName(firstName) && validateName(lastName) && validateAge(age) && validateGender(gender) && Checkemail(email) && validatePassword(password)) {

            fetch('/resgester', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ FirstName: firstName, LastName: lastName, Email: email, Password: password, Age: age, Gender: gender, Nickname: nickname })
            })
                .then((response) => response.json())
                .then((result) => {
                    
                    if (result) {
                        if (result.StatusCode) {
                            Error(result.StatusCode, result.error)
                        } else if (result.success) {
                            showError(result.message)
                        } else {
                            handle()
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }
}

export function LogoutHandel() {
    fetch("/logout", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if (data.status == true) {
                    document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    Checkstuts()
                }
            }

        })
        .catch(error => {
            console.error(error);
        });
}
