package handler

import (
	"html/template"
	"net/http"
)

func First(w http.ResponseWriter, r *http.Request) {
	// fmt.Println(r.URL.Path)
	index := template.Must(template.ParseFiles("../presentation/template/index.html"))
	index.Execute(w, nil)

}
