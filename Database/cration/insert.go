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

func InsertCategory(user_id int, title string, content string, created_at string, catygory string) error {
	info, err := DB.Prepare("INSERT INTO postes (user_id,title,content,created_at,categories) VALUES (?,?,?,?,?)")
	if err != nil {
		return err
	}
	_, err = info.Exec(user_id, title, content, created_at, catygory)
	if err != nil {
		return err
	}
	return nil
}
