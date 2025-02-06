import { showError } from "./errore.js"
import {Login,Regester,Homepage} from "./pages.js"
import {handle} from "./login-register.js"
import {HomeHandeler} from "./Homehandler.js"
function Checkemail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        showError("Invalid email address")
        return false
    } else {
        return true
    }
}

function validatePassword(password) {
    const hasTwoNumbers = (/\d{2,}/).test(password);

    const hasTwoLetters = (/[a-zA-Z]{3,}/).test(password);
    if (password.length > 20 || !hasTwoLetters || !hasTwoNumbers ) {
        showError("Password must be less than 20 characters and contain at least 2 numbers and 3 letters")
        return false;
    }
    return true;

}


function validateName(username) {
    const hasTwoLetters = (/[a-zA-Z]{4,}/).test(username);

    if (!hasTwoLetters) {
        showError("Name must be at least 4 characters")
        return false
    }
    return true;
}

function validateAge(age) {
    const hasTwoNumbers = (/\d{2,}/).test(age);
    if (age < 5 || age > 150 || !hasTwoNumbers) {
        showError("Age must be between 5 and 150")
        return false;
    }
    return true;
}

function validateGender(gender) {
    if (gender !== "male" && gender !== "female") {
        showError("Gender must be 'male' or 'female'")
        return false
    }
    return true;
}

// function validateNickname(name) {
//     const hasTwoLetters = (/^[a-zA-Z][a-zA-Z0-9_]{2,14}$/).test(name);
//     return hasTwoLetters;
// }

async function Checkstuts(event){
 
    event.preventDefault()
   
    fetch('/stuts', {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
       },
   })
       .then((response) => response.json())
       .then((result) => {
        
           if (!result.status) {
            console.log(result.error);
            handle()
           } else {
            let head = document.querySelector(".g")
            head.setAttribute("class",result.name)
            HomeHandeler()
           }
        
       })
       .catch((error) => {
           console.error("Error:", error);
       });

    // Delay l'appel handle jusqu'à ce que l'élément soit disponible dans DOM

       
       
}

const Dateformat = (timestamp) => {
  
    
    let pastDate = new Date(timestamp);
    pastDate.setHours(pastDate.getHours()-1)
    console.log("Date : ",pastDate); // 2025-02-06 17:41:25
    let now = new Date();
    let seconds = Math.floor((now-pastDate) / 1000); // Correction: now - pastDate
    
    if (seconds < 60) {
        return `${seconds} seconds`;
    } else if (seconds < 3600) {
        return `${Math.floor((seconds / 60))} minutes`;
    } else if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)} heures`;
    } else {
        return `${Math.floor(seconds / 86400)} jours`;
    }
}

export { Checkemail, validatePassword, validateName, validateAge, validateGender,Checkstuts ,Dateformat} 