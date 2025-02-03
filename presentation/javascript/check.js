function Checkemail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const hasTwoNumbers = (/\d{2,}/).test(password);

    const hasTwoLetters = (/[a-zA-Z]{2,}/).test(password);

    return hasTwoNumbers && hasTwoLetters;
}


function validateName(username) {
    const hasTwoLetters = (/[a-zA-Z]{4,}/).test(username);

    return hasTwoLetters;
}

function validateAge(age) {
    const hasTwoNumbers = (/\d{2,}/).test(age);

    return hasTwoNumbers;
}

function validateGender(gender) {

    return gender === "male" || gender === "female";
}

function validateNickname(name) {
    const hasTwoLetters = (/[a-zA-Z0-9]{4,}/).test(name);

    return hasTwoLetters;
}

export { Checkemail, validatePassword, validateName, validateAge, validateGender, validateNickname }