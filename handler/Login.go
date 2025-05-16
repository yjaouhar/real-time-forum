package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	db "real-time-forum/Database"
	"real-time-forum/servisse"

	"real-time-forum/utils"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/login", "POST") {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	email := r.FormValue("email")
	password := r.FormValue("password")

	var boo bool
	var err error
	typ := ""
	var hashedPassword string
	if strings.Contains(email, "@") {
		boo = db.CheckInfo(email, "email")
		typ = "email"
	} else {
		boo = db.CheckInfo(email, "nikname")
		typ = "nikname"
	}

	if !boo {
		hashedPassword, err = db.Getpasswor(typ, email)
	}

	if boo || err != nil || !utils.ComparePassAndHashedPass(hashedPassword, password) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error": "Invalid ` + typ + ` or password", "status":false}`))
		return
	}
	SessionToken, erre := utils.GenerateSessionToken()
	if erre != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"error": "Internal server error", "StatusCode": 500})
		return

	}
	expiry := time.Now().Add(24 * time.Hour)
	err = db.Updatesession(typ, SessionToken, expiry, email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"error": "Internal server error", "StatusCode": 500})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "SessionToken",
		Value:   SessionToken,
		Expires: expiry,
		Path:    "/",
	})
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":true}`))
}
