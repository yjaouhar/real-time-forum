package handler

import (
	"html/template"
	"net/http"
)

func First(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	if r.URL.Path != "/" {
		http.Error(w, "Page Not Found", http.StatusNotFound)
		return
	}
	index := template.Must(template.ParseFiles("../presentation/template/index.html"))
	index.Execute(w, nil)

}
