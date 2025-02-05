import { showError } from "./errore.js"
import {Login,Regester,Homepage} from "./pages.js"
import {handle} from "./login-register.js"
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
            handle()
          
            console.log("fih cokes");
            
           
           } else {
            console.log("mafihch");
            Homepage()
           }
        
       })
       .catch((error) => {
           console.error("Error:", error);
       });

    // Delay l'appel handle jusqu'à ce que l'élément soit disponible dans DOM

       
       
}


export { Checkemail, validatePassword, validateName, validateAge, validateGender,Checkstuts }