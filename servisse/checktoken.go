package servisse

import (
	"errors"
	"net/http"

	db "real-time-forum/Database/cration"
)

func IsHaveToken(r *http.Request) error {
	sesiontoken, err := r.Cookie("SessionToken")
	if err != nil || sesiontoken.Value == "" || !db.HaveToken(sesiontoken.Value) {
		return errors.New("Unauthorized")
	}
	return nil
}
