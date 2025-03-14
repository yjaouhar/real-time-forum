package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
	"real-time-forum/utils"
)

var sr = 0

func Categore(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/categories", "POST") {
		return
	}
	var err error
	var post []utils.Postes
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}

	token, _ := r.Cookie("SessionToken")
	userid := db.GetId("sessionToken", token.Value)
	categories := []string{r.FormValue("categories")}

	err = servisse.CategoriesValidator(categories)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "Bad request", "StatusCode":400}`))
		return
	}

	lastdata := r.FormValue("lastdata")
	if lastdata == "true" {
		sr, err = db.Getlastid(categories[0])
		if err != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"NoData": true }`))
			return
		}
	}
	if sr == -1 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"finish": true}`))
		return
	}

	post, sr, err = db.GetCategories(categories[0], sr, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal server error", "StatusCode":500}`))
		return
	}
	if len(post) < 10 {
		sr = -1
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}
