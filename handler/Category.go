package handler

import (
	"net/http"

	db "real-time-forum/Database/cration"
)

func Category(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		tocken, err := r.Cookie("SessionToken")
		if err != nil || tocken.Value == "" {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "Login Unsuccessful", "status":false}`))
			return
		}
		isHave := db.HaveToken("sessionToken", tocken.Value)

		if !isHave {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "Login Unsuccessful", "status":false}`))
		} else {
			title := r.FormValue("title")
			content := r.FormValue("content")
			user_id := db.GetId("sessionToken", tocken.Value) 
			err := db.InsertCategory(user_id, title, content, "now()")
			if err != nil {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte(`{"error": "Login Unsuccessful", "status":false}`))
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "Login successful", "status":true}`))
		}
	}
}
