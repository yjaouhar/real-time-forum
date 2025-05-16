package utils

import (
	"fmt"
	"regexp"
	"strconv"
)

func CheckEmail(email string) bool {
	re := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	if !re.MatchString(email) {
		fmt.Println("Invalid email address")
		return false
	}
	return true
}

func ValidatePassword(password string) bool {
	hasTwoNumbers := regexp.MustCompile(`\d{2,}`).MatchString(password)
	hasThreeLetters := regexp.MustCompile(`[a-zA-Z]{3,}`).MatchString(password)

	if len(password) > 20 || !hasTwoNumbers || !hasThreeLetters {
		fmt.Println("Password must be less than 20 characters and contain at least 2 numbers and 3 letters")
		return false
	}
	return true
}

func ValidateName(username string) bool {
	hasFourLetters := regexp.MustCompile(`[a-zA-Z]{4,}`).MatchString(username)

	if !hasFourLetters {
		fmt.Println("Name must be at least 4 characters")
		return false
	}
	return true
}

func ValidateAge(agee string) bool {
	age, err := strconv.Atoi(agee)
	if err != nil {
		fmt.Println("Age must be a number")
		return false
	}
	if age < 5 || age > 150 {
		fmt.Println("Age must be between 5 and 150")
		return false
	}
	return true
}

func ValidateGender(gender string) bool {
	if gender != "male" && gender != "female" {
		fmt.Println("Gender must be 'male' or 'female'")
		return false
	}
	return true
}

func ValidateNickname(name string) bool {
	re := regexp.MustCompile(`^[a-zA-Z][a-zA-Z0-9_]{2,14}$`)
	if !re.MatchString(name) {
		fmt.Println("Nickname is not correct")
		return false
	}
	return true
}
