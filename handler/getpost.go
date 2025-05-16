package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	db "real-time-forum/Database"
	"real-time-forum/servisse"
)



func Getpost(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/getpost", "POST") {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	var err error
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}
	str := 0
	token, _ := r.Cookie("SessionToken")
	userid := db.GetId("sessionToken", token.Value)
	lastdata := r.FormValue("lastdata")
	postid := r.FormValue("id")
	if lastdata == "true" {
		str, err = db.Getlastid("")
		if err != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"finish": true}`))
			return
		}
		lastdata = "false"
	} else {
		str, err = strconv.Atoi(postid)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]any{"error": "Bad Request", "StatusCode": 400})
			return
		}
	}



	Postes, err := db.GetPostes(str, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"error": "Internal server error", "StatusCode": 500})
		return
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Postes)
}
