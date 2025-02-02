

let regester = document.getElementById("register-container")
let login = document.getElementById("login-container")
regester.style.display = "none"
let creat_account = document.getElementById("c-a")
let login_bottone = document.getElementById("login-btn")
login_bottone.addEventListener("click", loginHandel)
creat_account.addEventListener("click", CreatAccounte)

function loginHandel(event) {


}

function CreatAccounte(event) {
    
    login.style.display = "none"
    regester.style.display = "flex"
    let regester_bottone = document.getElementById("creat-btn")

    let f = document.getElementById("f")
    let l = document.getElementById("l")
    let a = document.getElementById("age")
    let g = document.getElementById("gender")
    let n = document.getElementById("username")
    let e = document.getElementById("email")
    let p = document.getElementById("password")

    regester_bottone.addEventListener("click", debounce(function (event) {
       
        event.preventDefault();
        if (f.value !== "" && l.value !== "" && a.value !== "" && g.value !== "" && n.value !== "" && e.value !== "" && p.value !== "") {
            console.log("///////");

        } else {
            
            let err = document.querySelector(".fill")
            err.style.display = "flex"
        }

    }, 5000))
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