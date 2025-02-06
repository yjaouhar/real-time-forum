package handler

import (
	"fmt"
	"net/http"

	db "real-time-forum/Database/cration"
)

func Stuts(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {

		w.Header().Set("Content-Type", "application/json")

		sesiontoken, err := r.Cookie("SessionToken")
		fmt.Println(sesiontoken.Value)
		if err != nil || sesiontoken.Value == "" {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "Login Unsuccessful", "status":false}`))
			return
		}
		isHave := db.HaveToken( sesiontoken.Value)
		if !isHave {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "Login Unsuccessful", "status":false}`))
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "Login successful", "status":true}`))
		}
	}
}
