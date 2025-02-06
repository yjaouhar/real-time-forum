package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
)

func Getpost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	Postes ,err := db.GetPostes()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal ServerError", "status":false}`))
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Postes)
}
