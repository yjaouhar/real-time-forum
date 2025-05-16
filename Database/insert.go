package db

import (
	"strconv"
	"strings"
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

func InsertPostes(user_id int, title string, content string, catygory []string) error {
	created_at := time.Now().Format("2006-01-02 15:04:05")
	info, err := DB.Prepare("INSERT INTO postes (user_id,title,content,created_at,categories) VALUES (?,?,?,?,?)")
	if err != nil {
		return err
	}
	_, err = info.Exec(user_id, title, content, created_at, strings.Join(catygory, " "))
	if err != nil {
		return err
	}
	var post_id string
	err = DB.QueryRow(`SELECT id FROM postes WHERE user_id = ? AND title = ? AND content = ? AND created_at = ?`, user_id, title, content, created_at).Scan(&post_id)
	if err != nil {
		return err
	}
	id, err := strconv.Atoi(post_id)
	if err != nil {
		return err
	}
	err = InsertCategory(id, catygory)
	if err!=nil{
		err=Deletpost(id)
		if err!=nil{
			return err
		}
		return err
	}
	return nil
}

func InsertCategory(post_id int, catygory []string) error {
	for _, v := range catygory {
		info, err := DB.Prepare("INSERT INTO categories (post_id,category) VALUES (?,?)")
		if err != nil {
			return err
		}
		_, err = info.Exec(post_id, strings.ToLower(v))
		if err != nil {
			return err
		}
	}
	return nil
}

func Deletpost(postID int)error{
	stmt, err := DB.Prepare("DELETE FROM postes WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(postID)
	if err != nil {
		return err
	}

	return nil
}

func InsertComment(post_id int, user_id int, comment string) error {
	created_at := time.Now().Format("2006-01-02 15:04:05")
	info, err := DB.Prepare("INSERT INTO comments (post_id , user_id , comment , created_at) VALUES (?,?,?,?)")
	if err != nil {
		return err
	}
	_, err = info.Exec(post_id, user_id, comment, created_at)
	if err != nil {
		return err
	}
	return nil
}

func UpdateTocken(tocken string) error {
	info, err := DB.Prepare("UPDATE users SET sessionToken = NULL , expiry = NULL WHERE sessionToken = ?")
	if err != nil {
		return err
	}
	_, err = info.Exec(tocken)
	if err != nil {
		return err
	}
	return nil
}

func InsertConnection(sender string, recever string) error {
	info, err := DB.Prepare("INSERT INTO connection (user_1,user_2) VALUES (?,?)")
	if err != nil {
		return err
	}
	_, err = info.Exec(sender, recever)
	if err != nil {
		return err
	}
	return nil
}

func InsertMessage(sender string, recever string, message string) error {
	date := time.Now().Format("2006-01-02 15:04:05")
	id, err := QueryConnection(sender, recever)
	if err != nil {
		InsertConnection(sender, recever)
		id, err = QueryConnection(sender, recever)
		if err != nil {
			return err
		}
	}
	info, err := DB.Prepare("INSERT INTO messages (connection_id,sender_id,receiver_id,message,timestamp) VALUES (?,?,?,?,?)")
	if err != nil {
		return err
	}

	_, err = info.Exec(id, sender, recever, message, date)
	if err != nil {
		return err
	}
	return nil
}
