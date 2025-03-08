package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

var (
	end = 0
	str = 0
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

	token, _ := r.Cookie("SessionToken")
	userid := db.GetId("sessionToken", token.Value)
	if userid < 1 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Bad Request", "StatusCode": 400})
		return
	}
	lastdata := r.FormValue("lastdata")
	if lastdata == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Bad Request", "StatusCode": 400})
		return
	}
	if lastdata == "true" {
		str, err = db.Getlastid("")
		if err != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"finish": true}`))
			return
		}
		lastdata = "false"
	}
	if str == 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"finish": true}`))
		return
	}

	if str > 10 {
		end = str - 10
	} else if str < 10 {
		end = 0
	}

	Postes, err := db.GetPostes(str, end, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Internal server error", "StatusCode": 500})
		return
	}
	if end-10 >= 0 {
		str = end
		end -= 10
	} else {
		str = end
		end = 0
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Postes)
}
