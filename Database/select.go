package db

import (
	"errors"
	"sort"
	"strings"
	"time"

	"real-time-forum/utils"
)

func CheckInfo(info string, input string) bool { ////hna kanoxofo wax email ola wax nikname kayn 3la hsab input xno fiha wax email ola wax nikname
	var inter int
	quire := "SELECT COUNT(*) FROM users WHERE " + input + " = ?"
	err := DB.QueryRow(quire, info).Scan(&inter)
	if err != nil {
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

func Updatesession(typ string, tocken string, expiry time.Time, input string) error {
	query := "UPDATE users SET sessionToken = ? , expiry = ? WHERE " + typ + " = ?"
	_, err := DB.Exec(query, tocken, expiry, input)
	if err != nil {
		return err
	}
	return nil
}

func HaveToken(tocken string) bool {
	var expiry time.Time
	quire := "SELECT expiry FROM users WHERE sessionToken = ? "
	err := DB.QueryRow(quire, tocken).Scan(&expiry)
	if err != nil {
		return false
	}
	return expiry.After(time.Now())
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

func GetPostes(str int, userid int) ([]utils.Postes, error) {
	var postes []utils.Postes
	quire := "SELECT id, user_id, title, content, categories, created_at FROM postes WHERE id <= ? ORDER BY created_at DESC LIMIT 10 "
	rows, err := DB.Query(quire, str)
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
		post.Nembre, err = LenghtComent(post.ID)
		post.Username = GetUser(post.UserID)
		if post.Username == "" {
			return nil, err
		}

		postes = append(postes, post)
	}

	return postes, nil
}

func GetCategories(category string, start int, userid int) ([]utils.Postes, error) {
	var postes []utils.Postes

	quire := "SELECT post_id FROM categories WHERE category = ? AND id <= ? ORDER BY id DESC LIMIT 10"
	rows, err := DB.Query(quire, strings.ToLower(category), start)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		err := rows.Scan(&id)
		if err != nil {
			return nil, err
		}
		var post utils.Postes
		quire := "SELECT id, user_id, title, content, categories, created_at FROM postes WHERE id = ?"
		err = DB.QueryRow(quire, id).Scan(&post.ID, &post.UserID, &post.Title, &post.Content, &post.Categories, &post.CreatedAt)
		if err != nil {
			return nil, err
		}
		post.Nembre, err = LenghtComent(post.ID)
		post.Username = GetUser(post.UserID)
		if post.Username == "" {
			return nil, err
		}

		postes = append(postes, post)

	}

	if len(postes) == 0 {
		return nil, errors.New("empty data")
	}
	return postes, nil
}

func LenghtComent(postid int) (nbr int, err error) {
	nbr = 0 // initialize the counter to 0
	quire := "SELECT COUNT(*) FROM comments WHERE post_id =?"
	err = DB.QueryRow(quire, postid).Scan(&nbr)
	if err != nil {
		return 0, err
	}
	return nbr, nil
}

func SelectComments(postid int, userid int) ([]utils.CommentPost, error) {
	var comments []utils.CommentPost
	quire := "SELECT id, post_id, user_id, comment, created_at FROM comments WHERE post_id = ? ORDER BY created_at DESC"
	rows, err := DB.Query(quire, postid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var comment utils.CommentPost
		err := rows.Scan(&comment.ID, &comment.PostID, &comment.UserID, &comment.Content, &comment.CreatedAt)
		if err != nil {
			return nil, err
		}

		comment.Username = GetUser(comment.UserID)
		comments = append(comments, comment)
	}

	return comments, nil
}

func SelectPostid(postid int) bool {
	id := 0
	query := "SELECT id FROM postes WHERE id = ?"
	err := DB.QueryRow(query, postid).Scan(&id)
	if err != nil {
		return false
	}
	return id >= 1
}

func Getlastid(cat string) (int, error) {
	id := 0
	query := "SELECT id FROM postes ORDER BY id DESC LIMIT 1"
	err := DB.QueryRow(query).Scan(&id)
	if cat != "" {
		query = "SELECT id FROM categories WHERE category = ? ORDER BY id DESC LIMIT 1"
		err = DB.QueryRow(query, strings.ToLower(cat)).Scan(&id)
	}

	if err != nil {
		return 0, err
	}
	return id, nil
}

func Select_all_nakname(nickname string) ([]utils.AllNakename, error) {
	var All []utils.AllNakename
	quire := "SELECT id, nikname FROM users ORDER BY nikname COLLATE NOCASE ASC"
	rows, err := DB.Query(quire)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var Name utils.AllNakename
		err := rows.Scan(&Name.Id, &Name.Nickname)
		if err != nil {
			return nil, err
		}
		Name.Time, _ = Selectlastmessage(Name.Nickname, nickname)
		Name.Type = CheckStatus(Name.Nickname)
		All = append(All, Name)
	}

	// 
	sort.Slice(All, func(i, j int) bool {
		return All[i].Time.After(All[j].Time) // After: akthar 9rban
	})

	return All, nil
}

func CheckStatus(nickname string) string {
	if utils.Clients[nickname] != nil {
		return "online"
	}
	return "offline"
}

func QueryConnection(user_1 string, user_2 string) (int, error) {
	id := 0
	quire := "SELECT id FROM connection WHERE  (user_1 = ? AND user_2 = ?)"
	err := DB.QueryRow(quire, user_1, user_2).Scan(&id)
	if err != nil {
		quire = "SELECT id FROM connection WHERE (user_1 = ? AND user_2 = ?)"
		err = DB.QueryRow(quire, user_2, user_1).Scan(&id)
		if err != nil {
			return 0, err
		}
	}
	return id, nil
}

func QueryMessage(sender string, recever string, first string, last int) ([]utils.Messages, error) {
	connectionid, err := QueryConnection(sender, recever)
	if err != nil {
		return nil, err
	}
	if first == "true" {
		last = Getlastmessage(connectionid)
	}

	var Msg []utils.Messages
	quire := "SELECT id, sender_id, receiver_id, message, timestamp FROM messages WHERE connection_id = ? AND id<= ?  ORDER BY timestamp DESC LIMIT 10"
	rows, err := DB.Query(quire, connectionid, last)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var msg utils.Messages
		err := rows.Scan(&msg.Id, &msg.Sender, &msg.Recever, &msg.Message, &msg.Time)
		if err != nil {
			return nil, err
		}
		Msg = append(Msg, msg)
	}

	return Msg, nil
}

func Getlastmessage(id int) int {
	lastid := 0
	quire := "SELECT id FROM messages WHERE connection_id = ? ORDER BY timestamp DESC LIMIT 1"
	err := DB.QueryRow(quire, id).Scan(&lastid)
	if err != nil {
		return 0
	}
	return lastid
}

func Selectlastmessage(receiver_id string, sender_id string) (time.Time, error) {
	var last1 time.Time
	var last2 time.Time
	quire := "SELECT timestamp FROM messages WHERE receiver_id = ? AND sender_id = ? ORDER BY timestamp DESC LIMIT 1"
	err := DB.QueryRow(quire, receiver_id, sender_id).Scan(&last1)
	quire = "SELECT timestamp FROM messages WHERE receiver_id = ? AND sender_id = ? ORDER BY timestamp DESC LIMIT 1"
	er := DB.QueryRow(quire, sender_id, receiver_id).Scan(&last2)
	if err != nil && er != nil {
		return time.Time{}, err
	}
	if err != nil && er == nil {
		return last2, nil
	}
	if err == nil && er != nil {
		return last1, nil
	}
	if last1.After(last2) {
		return last1, nil
	}
	return last2, nil
}
