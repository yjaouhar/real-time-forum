package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
)

func Contact(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Content-Type", "aplication/json")
		token, err := r.Cookie("SessionToken")
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		nickname := db.GetUser(db.GetId("sessionToken", token.Value))
		Allusers, err := db.Select_all_nakname(nickname)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Allusers)
	}
}
