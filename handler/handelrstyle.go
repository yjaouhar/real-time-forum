package handler

import (
	"fmt"
	"net/http"
	"os"
)

func Style(w http.ResponseWriter, r *http.Request) {
	// file := r.PathValue("file")
	fmt.Println(55)

	style := http.StripPrefix("/static/css/", http.FileServer(http.Dir("../presentation/static/css")))

	//	fmt.Println(style)
	// Check if the requested file exists by trying to read it
	_, err := os.ReadFile("../presentation/static/css/style.css")
	if err != nil {
		// fmt.Println(file)
		// Error(w, http.StatusNotFound)
		return
	}

	style.ServeHTTP(w, r)

}
