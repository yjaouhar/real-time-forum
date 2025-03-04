export function showError(message) {
    let err = document.getElementById("error-message")

    err.textContent = message
    err.style.display = "block"
    err.style.color = "red"
}

