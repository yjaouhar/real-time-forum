import { Regester } from "./pages.js"
import { showError } from "./errore.js"
import { Checkemail, validateAge, validateGender, validateName, validatePassword } from "./check.js"


let login = document.getElementById("login-container")

let creat_account = document.getElementById("c-a")
let login_bottone = document.getElementById("login-btn")

login_bottone.addEventListener("click", loginHandel)
creat_account.addEventListener("click", CreatAccounte)

function loginHandel(event) {
}

function CreatAccounte(event) {
    Regester()
    let regester_form = document.getElementById("register-form")
    regester_form.addEventListener("submit", handleRegister)

}

async function handleRegister(ev) {
    ev.preventDefault();

    console.log("Register button clicked!");

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let nickname = document.getElementById("nickname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log(firstName, lastName, age, gender, nickname, email, password);

    console.log("=====>", validateName(firstName));
    console.log("=====>", validateName(lastName));
    console.log("=====>", validateAge(age));
    console.log("=====>", validateGender(gender));
    console.log("=====>", Checkemail(email));
    console.log("=====>", validatePassword(password));

    if (validateName(firstName) && validateName(lastName) && validateAge(age) && validateGender(gender) && Checkemail(email) && validatePassword(password)) {

        console.log("Form submitted successfully!==========");
        try {
            await fetch('http://localhost:8080/resgester', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ FirstName: firstName, LastName: lastName, Email: email, Password: password, Age: age, Gender: gender, Nickname: nickname })
            });
        } catch (error) {
            console.log('Error:', error);
            response.textContent = 'An error occurred while sending the request.';
        }
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