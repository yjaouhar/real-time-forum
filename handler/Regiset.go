package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	db "real-time-forum/Database/cration"
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
		validateur := db.CheckInfo(info.Email)
		if !validateur {
			fmt.Println("Email already exists")
			return
		}
		validateur = db.CheckInfo(info.Nickname)
		if !validateur {
			fmt.Println("Nickname already exists")
			return
		}

		err := db.Insertuser(info.FirstName, info.LastName, info.Email, info.Gender, info.Age, info.Nickname, info.Password)
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}
