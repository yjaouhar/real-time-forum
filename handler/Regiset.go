package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Age       string `json:"age"`
	Gender    string `json:"gender"`
	Nickname  string `json:"nickname"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var info User
		errore := json.NewDecoder(r.Body).Decode(&info)
		if errore != nil {
			fmt.Println(errore)
			return
		}
	}
}
