package servisse

import "net/http"

func CheckErr(w http.ResponseWriter, r *http.Request, path string, method string) bool {
	if r.Method != method {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(`{"error": "Method not allowed", "status":false , "StatusCode":405}`))
		return false
	}
	if r.URL.Path != path {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error": "Not found", "status":false , "StatusCode":404}`))
		return false
	}
	return true
}
