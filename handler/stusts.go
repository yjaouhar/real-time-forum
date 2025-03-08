package handler

import (
	"net/http"

	"real-time-forum/servisse"
)

func Stuts(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Content-Type", "application/json")
		name, ishave := servisse.IsHaveToken(r)
		if ishave != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + ishave.Error() + `", "status":false}`))
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"error": "Login successful","name": "` + name + `","status":true}`))

	}else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(`{"error": "Method not allowed", "status":false , "StatusCode":405}`))
	}
}
