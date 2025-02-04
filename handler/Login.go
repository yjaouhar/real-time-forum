package handler

import (
	"net/http"
	"strings"

	db "real-time-forum/Database/cration"

	"real-time-forum/utils"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		email := r.FormValue("email")
		password := r.FormValue("password")
		w.Header().Set("Content-Type", "application/json")
		var boo bool
		var err error
		var hashedPassword string
		if strings.Contains(email, "@") {
			boo = db.CheckInfo(email, "email")
		} else {
			boo = db.CheckInfo(email, "nikname")
		}
		if boo {
			hashedPassword, err = db.Getpasswor(email)
		}
		if !boo || err != nil || !utils.ComparePassAndHashedPass(hashedPassword, password) {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "Invalid email or password", "status":false}`))
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"error": "Login successful", "status":true}`))
		// fmt.Println("Email:", email, "Password:", password)

	}
}
