package handler

import (
	"fmt"
	"net/http"
	"strings"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

func Post(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		_, ishave := servisse.IsHaveToken(r)
		if ishave != nil {
			fmt.Println("token not found POST")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "` + ishave.Error() + `", "status":false , "tocken":false}`))
			return
		}
		title := r.FormValue("title")
		content := r.FormValue("content")
		categories := r.Form["categories"]
		if len(categories) == 0 || title == "" || content == "" {
			fmt.Println("bad request")
			return
		}
		err := servisse.CategoriesValidator(categories)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error": "Bade Request", "status":false}`))
			return
		}
		tocken, _ := r.Cookie("SessionToken")
		user_id := db.GetId("sessionToken", tocken.Value)
		errore := db.InsertPostes(user_id, title, content, strings.Join(categories, " "))
		
		if errore != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error": "Internal ServerError", "status":false}`))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"error": "Login successful", "status":true}`))

	}
}
