package db

import (
	"fmt"
	"strconv"
	"time"
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

func InsertCategory(user_id int, title string, content string, catygory string) error {
	created_at := time.Now().Format("2006-01-02 15:04:05")
	fmt.Println(created_at)
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
