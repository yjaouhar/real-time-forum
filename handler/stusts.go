package handler

import (
	"net/http"

	"real-time-forum/servisse"
)

func Stuts(w http.ResponseWriter, r *http.Request) {

	if !servisse.CheckErr(w, r, "/stuts", "GET") {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	name, ishave := servisse.IsHaveToken(r)
	if ishave != nil || name == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"token":false}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"name": "` + name + `","token":true}`))
}
