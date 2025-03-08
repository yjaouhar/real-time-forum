export function Error(status, messag) {
    let header = document.querySelector(".header")
    let container = document.querySelector(".container")
    if (header != null || container != null) {
    header.style.display = "none"
    container.style.display = "none"
    }
    let div_err = document.querySelector(".error-container")
    if (div_err == null) {
    let div_err = document.createElement("div")
    div_err.setAttribute("class", "error-container")
    let err = document.createElement("h1")
    err.textContent = status
    err.setAttribute("class", "h1-err")
    let message = document.createElement("p")
    message.textContent = messag
    message.setAttribute("class", "p-err")
    let btn = document.createElement("button")
    btn.setAttribute("class", "bt-err")
    btn.textContent = "back to home"
    btn.addEventListener("click", () => {
        header.style.display = "flex"
        container.style.display = "flex"
        div_err.style.display = "none"
    })
    div_err.append(err)
    div_err.append(message)
    div_err.append(btn)
    document.body.append(div_err)
    }else{
        div_err.style.display = "flex"
        let h1_err = document.querySelector(".h1-err")
        let p_err = document.querySelector(".p-err")
        h1_err.textContent = status
        p_err.textContent = messag
    }
}