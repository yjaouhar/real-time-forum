package db

import (
	"fmt"

	"real-time-forum/utils"
)

func CheckInfo(info string, input string) bool { ////hna kanoxofo wax email ola wax nikname kayn 3la hsab input xno fiha wax email ola wax nikname
	var inter int
	quire := "SELECT COUNT(*) FROM users WHERE " + input + " = ?"
	err := DB.QueryRow(quire, info).Scan(&inter)
	if err != nil {
		fmt.Println(err)
		return false
	}

	return inter == 0
}

func Getpasswor(input string, typ string) (string, error) {
	var password string
	quire := "SELECT password FROM users WHERE " + input + " = ?"
	err := DB.QueryRow(quire, typ).Scan(&password)
	if err != nil {
		return "", err
	}
	return password, nil
}

func Updatesession(typ string, tocken string, input string) error {
	query := "UPDATE users SET sessionToken = $1 WHERE " + typ + " = $2"
	_, err := DB.Exec(query, tocken, input)
	if err != nil {
		return err
	}
	return nil
}

func HaveToken(tocken string) bool {
	var token int
	quire := "SELECT COUNT(*) FROM users WHERE sessionToken = ?"
	err := DB.QueryRow(quire, tocken).Scan(&token)
	if err != nil {
		return false
	}
	return token == 1
}

func GetId(input string, tocken string) int {
	var id int
	quire := "SELECT id FROM users WHERE " + input + " = ?"
	err := DB.QueryRow(quire, tocken).Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

func GetUser(id int) string {
	var name string
	quire := "SELECT nikname FROM users WHERE id = ?"
	err := DB.QueryRow(quire, id).Scan(&name)
	if err != nil {
		return ""
	}
	return name
}

func GetPostes() ([]utils.Postes, error) {
	var postes []utils.Postes
	quire := "SELECT id, user_id, title, content, categories, created_at FROM postes ORDER BY created_at DESC "
	rows, err := DB.Query(quire)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post utils.Postes
		err := rows.Scan(&post.ID, &post.UserID, &post.Title, &post.Content, &post.Categories, &post.CreatedAt)
		if err != nil {
			return nil, err
		}
		post.Username = GetUser(post.UserID)
		if post.Username == "" {
			return nil, err
		}
		postes = append(postes, post)
	}
	return postes, nil
}
