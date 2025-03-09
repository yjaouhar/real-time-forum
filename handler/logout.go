package handler

import (
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/logout", "POST") {
		return
	}
	tocken, _ := r.Cookie("SessionToken")
	_ = db.UpdateTocken(tocken.Value)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"error": "Logout successful", "status":true}`))
}
