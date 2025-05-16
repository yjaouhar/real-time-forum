package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database"
	Error "real-time-forum/Error"
	"real-time-forum/servisse"
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
	if !servisse.CheckErr(w, r, "/resgester", "POST") {
		return
	}
	message := ""
	var info User
	errore := json.NewDecoder(r.Body).Decode(&info)
	if errore != nil {
		errNessage, statuscode := Error.Json(errore)
		w.WriteHeader(statuscode)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "message": errNessage, "StatusCode": statuscode})
		return
	}
	w.Header().Set("Content-Type", "application/json")

	if !utils.CheckEmail(info.Email) || !utils.ValidatePassword(info.Password) ||
		!utils.ValidateName(info.FirstName) || !utils.ValidateName(info.LastName) ||
		!utils.ValidateAge(info.Age) || !utils.ValidateGender(info.Gender) {
		message = "your information is invalid"
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "message": message})
		return
	}
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
		json.NewEncoder(w).Encode(map[string]any{"success": true, "message": message})
		return
	}

	var err error
	info.Password, err = utils.HashPassword(info.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "message": "Internal server error", "StatusCode": http.StatusInternalServerError})
		return
	}
	err = db.Insertuser(info.FirstName, info.LastName, info.Email, info.Gender, info.Age, info.Nickname, info.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "message": "Internal server error", "StatusCode": http.StatusInternalServerError})
		return
	}
	BroadcastUserStatus("new_contact", "", "offline", info.Nickname)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{"success": false, "message": ""})
}
