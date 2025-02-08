package utils

type Postes struct {
	ID         int
	UserID     int
	Username   string
	Title      string
	Content    string
	Categories string
	CreatedAt  string
	Nembre int
}


type Comment struct {
	Content       string `json:"content"`
	PostID       string   `json:"post_id"`
}

type CommentPost struct {
	ID         int
	PostID     int
	UserID     int
	Content    string
	CreatedAt  string
	Username   string
}

type Jsncomment struct {
	ID         string `json:"post_id"`
}

var LastId = 0
var Poste []Postes