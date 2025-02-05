package db

import (
	"strconv"
)

func Insertuser(first_name string, last_name string, email string, gender string, age string, nikname string, password string) error {
	infiuser, err := DB.Prepare("INSERT INTO users (first_name, last_name, email, gender, age, nikname, password) VALUES (?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	age_int, err := strconv.Atoi(age)
	if err != nil {
		return err
	}
	_, err = infiuser.Exec(first_name, last_name, email, gender, age_int, nikname, password)
	if err != nil {
		return err
	}
	return nil
}

func CheckInfo(info string, input string) bool { ////hna kanoxofo wax email ola wax nikname kayn 3la hsab input xno fiha wax email ola wax nikname
	var inter int
	quire := "SELECT COUNT(*) FROM users WHERE " + input + " = ?"
	err := DB.QueryRow(quire, info).Scan(&inter)
	if err != nil {
		return false
	}
	return inter == 0
}

func Getpasswor(input string) (string, error) {
	var password string
	quire := "SELECT password FROM users WHERE" + input + " = ?"
	err := DB.QueryRow(quire, input).Scan(&password)
	if err != nil {
		return "", err
	}
	return password, nil
}

func Getpasswor(input string) (string, error) {
	query := `UPDATE users SET email = $1 WHERE id = $2`
	_, err := db.Exec(query, newEmail, userID)
	if err != nil {
		return err
	}
	var password string
	quire := "SELECT password FROM users WHERE" + input + " = ?"
	err := DB.QueryRow(quire, input).Scan(&password)
	if err != nil {
		return "", err
	}
	return password, nil
}
