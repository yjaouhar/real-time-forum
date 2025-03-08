package servisse

import (
	"errors"
	"net/http"

	db "real-time-forum/Database/cration"
)

func IsHaveToken(r *http.Request) (string, error) {
	sesiontoken, err := r.Cookie("SessionToken")
	if err != nil || sesiontoken.Value == "" || !db.HaveToken(sesiontoken.Value) {
		return "", errors.New("Unauthorized")
	}
	id := db.GetId("sessionToken", sesiontoken.Value)
	if id < 1 {
		return "", errors.New("BadRequest")
	}
	name := db.GetUser(id)
	if name == "" {
		return "", errors.New("BadRequest")
	}
	return name, nil
}
