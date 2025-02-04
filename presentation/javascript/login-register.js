import { Regester } from "./pages.js"
import { showError } from "./errore.js"
import { Checkemail, validateAge, validateGender, validateName, validatePassword } from "./check.js"


let login = document.getElementById("login-container")

let creat_account = document.getElementById("c-a")
let login_form = document.getElementById("login-form")

login_form.addEventListener("submit", loginHandel)
creat_account.addEventListener("click", CreatAccounte)

function loginHandel(event) {
    event.preventDefault()
    const formData = new FormData(login_form);
    fetch('http://localhost:8080/login', {
        method: 'POST',
        body: formData

    })
}

function CreatAccounte(event) {
    Regester()
    let regester_form = document.getElementById("register-form")
    regester_form.addEventListener("submit", handleRegister)

}

function handleRegister(ev) {
    ev.preventDefault();
    console.log("Register button clicked!");
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let nickname = document.getElementById("nickname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (validateName(firstName) && validateName(lastName) && validateAge(age) && validateGender(gender) && Checkemail(email) && validatePassword(password)) {
        console.log("Form submitted successfully!==========");

        fetch('/resgester', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ FirstName: firstName, LastName: lastName, Email: email, Password: password, Age: age, Gender: gender, Nickname: nickname })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    showError(result.message)

                }else{
                    window.location.href="/"
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}