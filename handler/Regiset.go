package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
	Error"real-time-forum/Error"
	"real-time-forum/utils"
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
		message := ""
		var info User
		errore := json.NewDecoder(r.Body).Decode(&info)
		if errore != nil {
			errNessage, statuscode := Error.Json(errore)
			w.WriteHeader(statuscode)
			json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": errNessage , "StatusCode": statuscode})
			return
		}
		w.Header().Set("Content-Type", "application/json")
		validatEmail := db.CheckInfo(info.Email, "email")
		if !validatEmail {
			message = "Email already exists"
		}

		validatNikname := db.CheckInfo(info.Nickname, "nikname")
		if !validatNikname {
			message = "Nickname already exists"
		}
		if !validatEmail && !validatNikname {
			message = "Email and nickname already exist"
		}
		if message != "" {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "message": message})
			return
		}
		var err error
		info.Password, err = utils.HashPassword(info.Password)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "Internal server error" , "StatusCode": http.StatusInternalServerError})
			return
		}
		err = db.Insertuser(info.FirstName, info.LastName, info.Email, info.Gender, info.Age, info.Nickname, info.Password)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "Internal server error", "StatusCode": http.StatusInternalServerError})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": ""})
	}else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "Method not allowed", "StatusCode": http.StatusMethodNotAllowed})
	}
}
