package handler

import "net/http"

type Postes struct {
	ID         int
	Title      string
	Content    string
	Categories string
}

func Getpost(w http.ResponseWriter, r *http.Request) {
}
