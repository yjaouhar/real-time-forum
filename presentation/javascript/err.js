import { Checkstuts } from "./check.js"
export function Error() {
    let div_err = document.createElement("div")
    div_err.setAttribute("class", "error-container")
    let err = document.createElement("h1")
    err.setAttribute("class", "h1-err")
    let message = document.createElement("p")
    message.setAttribute("class", "p-err")
    let btn = document.createElement("button")
    btn.setAttribute("class", "bt-err")
    btn.textContent = "back to home"
    btn.addEventListener("click", () => {
        Checkstuts()
    })
    div_err.append(err)
    div_err.append(message)
    div_err.append(btn)
    document.body.append(div_err)
    div_err.style.display = "none"
}


export function DesplayError(status, err) {
    if (div_err = document.querySelector(".error-container")){
    let h1_err = document.querySelector(".h1-err")
    let p_err = document.querySelector(".p-err")
    h1_err.textContent = status
    p_err.textContent = err
}else{
    div_err = document.querySelector(".error-container").style.display = "flex"
    DesplayError(status, err)
}
}