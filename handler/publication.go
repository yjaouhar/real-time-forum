package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database"
	"real-time-forum/servisse"
)

func Post(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/pubpost", "POST") {
		return
	}
	_, ishave := servisse.IsHaveToken(r)
	if ishave != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}
	title := r.FormValue("title")
	content := r.FormValue("content")
	categories := r.Form["categories"]

	if len(categories) == 0 || title == "" || content == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"filldata": "false"})
		return
	}
	err := servisse.CategoriesValidator(categories)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "Bad Request", "StatusCode": 400})
		return
	}
	tocken, _ := r.Cookie("SessionToken")
	user_id := db.GetId("sessionToken", tocken.Value)
	errore := db.InsertPostes(user_id, title, content, categories)

	if errore != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"error": "Internal Server Error", "StatusCode": 500})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]any{"secsses": "true"})

}
