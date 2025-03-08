package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

func Contact(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/getcontact", "GET") {
		return
	}
	w.Header().Set("Content-Type", "aplication/json")
	nickname, err := servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"token":false}`))
		return
	}
	Allusers, err := db.Select_all_nakname(nickname)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Internal server error", "StatusCode": 500})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Allusers)

}
