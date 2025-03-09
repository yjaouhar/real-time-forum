package handler

import (
	"net/http"
	"os"
)

func Sta(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Path

	if r.Method != "GET" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	_, err := os.ReadFile("../presentation" + file)
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, "../presentation"+file)
}
