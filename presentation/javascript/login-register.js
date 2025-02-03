import { Regester } from "./pages.js"
import {Checkemail , validateAge, validateGender, validateName, validateNickname, validatePassword } from "./check.js"


// let regester = document.getElementById("register-container")
let login = document.getElementById("login-container")
// regester.style.display = "none"

let creat_account = document.getElementById("c-a")
let login_bottone = document.getElementById("login-btn")
// let regester_form = document.getElementById("register-form") // Hna l-form 

// Events
login_bottone.addEventListener("click", loginHandel)
creat_account.addEventListener("click", CreatAccounte)
// regester_form.addEventListener("submit", handleRegister) // 7iydna event mn button o dirna f form

function loginHandel(event) {
    // event.preventDefault(); 
}

function CreatAccounte(event) {
    Regester()
    let regester_form = document.getElementById("register-form")
    regester_form.addEventListener("submit", handleRegister)

}

function handleRegister(ev) {
  ev.preventDefault(); // Prevent form submit
    
    console.log("Register button clicked!");

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let nickname = document.getElementById("nickname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log(firstName, lastName, age, gender, nickname, email, password);
    
    

    if (!validateName(firstName) || !validateName(lastName) || !validateAge(age) || !validateGender(gender) || !validateNickname(nickname) || !Checkemail(email) || !validatePassword(password)) {
        let err = document.getElementById("error-message")
         err.textContent = "you have empty fields"
        err.style.display = "block"
         err.style.color = "red"
       
    } else {
       console.log("Form submitted successfully!");
       
    }
}



function debounce(func, delay) {
    let timeoutId;
    

    return function (...args) {
        // Clear any existing timeout
        clearTimeout(timeoutId);

        // Set a new timeout
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}