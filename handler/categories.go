package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	db "real-time-forum/Database"
	"real-time-forum/servisse"
	"real-time-forum/utils"
)

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

	token, err := r.Cookie("SessionToken")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}
	userid := db.GetId("sessionToken", token.Value)
	if userid == 0 {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal server error", "StatusCode":500}`))
		return
	}
	categories := []string{r.FormValue("categories")}

	err = servisse.CategoriesValidator(categories)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "Bad request", "StatusCode":400}`))
		return
	}
	sr := 0
	lastdata := r.FormValue("lastdata")
	postid := r.FormValue("id")
	if lastdata == "true" {
		sr, err = db.Getlastid(categories[0])
		if err != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"NoData": true }`))
			return
		}
		lastdata = "false"
	} else {
		sr, err = strconv.Atoi(postid)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]any{"error": "Bad Request", "StatusCode": 400})
			return
		}
	}

	post, err = db.GetCategories(categories[0], sr, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal server error", "StatusCode":500}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}
