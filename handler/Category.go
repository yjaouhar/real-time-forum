package handler

import (
	"net/http"
	"strings"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

func Post(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		tocken, err := r.Cookie("SessionToken")
		if err != nil || tocken.Value == "" {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "Unauthorized ", "status":false}`))
			return
		}
		isHave := db.HaveToken(tocken.Value)

		if !isHave {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "Unauthorized", "status":false}`))
		} else {
			title := r.FormValue("title")
			content := r.FormValue("content")
			categories := r.Form["categories"]
			err = servisse.CategoriesValidator(categories)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(`{"error": "Bade Request", "status":false}`))
				return
			}
			user_id := db.GetId("sessionToken", tocken.Value)
			err := db.InsertCategory(user_id, title, content, "now()", strings.Join(categories, " "))
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
