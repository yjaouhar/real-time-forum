package utils

type Postes struct {
	ID         int
	UserID     int
	Username   string
	Title      string
	Content    string
	Categories string
	CreatedAt  string
}

var LastId = 0
var Poste []Postes
