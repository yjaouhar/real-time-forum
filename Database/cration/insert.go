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

func InsertReaction(user_id int, content_id int, content_type string, reaction_type string) error {
	info, err := DB.Prepare("INSERT INTO reactions (user_id,content_type,content_id,reaction_type) VALUES (?,?,?,?)")
	if err != nil {
		fmt.Println("err select 1 : ", err)
		return err
	}
	_, err = info.Exec(user_id, content_type, content_id, reaction_type)
	if err != nil {
		fmt.Println("err select 2 :", err)
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

func DeleteReaction(user_id int, content_id int) error {
	info, err := DB.Prepare("DELETE FROM reactions WHERE user_id = ? AND content_id = ?")
	if err != nil {
		return err
	}
	_, err = info.Exec(user_id, content_id)
	if err != nil {
		return err
	}
	return nil
}

func Update(userid int, postid int, reactiontype string) error {
	info, err := DB.Prepare("UPDATE reactions SET reaction_type = ? WHERE user_id = ? AND content_id = ?")
	if err != nil {
		return err
	}
	_, err = info.Exec(reactiontype, userid, postid)
	if err != nil {
		return err
	}
	return nil
}
