package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
	"real-time-forum/utils"
)

var (
	sr = 0
)

func Categore(w http.ResponseWriter, r *http.Request) {
	var err error
	var post []utils.Postes
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error": "401", "status":false, "tocken":false}`))
		return
	}
	token, _ := r.Cookie("SessionToken")
	userid := db.GetId("sessionToken", token.Value)
	categories := []string{r.FormValue("categories")}
	err = servisse.CategoriesValidator(categories)
	if err != nil {
		fmt.Println("error :", categories)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error": "400", "status":false, "tocken":false}`))
		return
	}
	lastdata := r.FormValue("lastdata")
	if lastdata == "true" {
		sr, err = db.Getlastid(categories[0])
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error": "500", "status":false, "tocken":false}`))
			return
		}
	}

	post, sr, err = db.GetCategories(categories[0], sr, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "500", "status":false, "tocken":false}`))
		return
	}
	fmt.Println("==> categories len :", sr)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)

}
