let regester = document.getElementById("register-container")
let login = document.getElementById("login-container")
regester.style.display = "none"

let creat_account = document.getElementById("c-a")
let login_bottone = document.getElementById("login-btn")
let regester_form = document.getElementById("register-form") // Hna l-form 

// Events
login_bottone.addEventListener("click", loginHandel)
creat_account.addEventListener("click", CreatAccounte)
regester_form.addEventListener("submit", handleRegister) // 7iydna event mn button o dirna f form

function loginHandel(event) {
    event.preventDefault(); 
}

function CreatAccounte(event) {
    event.preventDefault();  
    login.style.display = "none"
    regester.style.display = "flex"
}

function handleRegister(ev) {
  ev.preventDefault(); // Prevent form submit
    
    console.log("Register button clicked!");

    let f = document.getElementById("f").value;
    let l = document.getElementById("l").value;
    let a = document.getElementById("age").value;
    let g = document.getElementById("gender").value;
    let n = document.getElementById("username").value;
    let e = document.getElementById("email").value;
    let p = document.getElementById("password").value;
    console.log(f, l, a, g, n, e, p);
    

    if (f === "" || l === "" || a === "" || g === "" || n === "" || e === "" || p === "") {
        let err = document.getElementById("error-message")
        err.style.display = "block"
        // err.style.color = "red"
        err.textContent = "you have empty fields"
    } else {
        let err = document.querySelector(".fill")
        err.style.display = "flex"
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