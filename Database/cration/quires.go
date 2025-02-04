package db

import "strconv"

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

func CheckInfo(info string) bool{
	var inter int
	quire := "SELECT * FROM users WHERE "+info+" = ?"
	err := DB.QueryRow(quire, info).Scan(&inter)
	if err != nil {
		return false
	}
	return inter == 0
}
