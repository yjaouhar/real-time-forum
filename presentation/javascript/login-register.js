
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
        let err = document.querySelector(".fill")
        event.preventDefault();
        if (f.value !== "" && l.value !== "" && a.value !== "" && g.value !== "" && n.value !== "" && e.value !== "" && p.value !== "") {
            login.style.display = "flex"
            regester.style.display = "none"
            err.style.display = "none"
        } else {
            err.style.display = "flex"
        }

    }, 300))
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