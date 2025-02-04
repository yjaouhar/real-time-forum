package handler

import (
	"fmt"
	"net/http"
	"os"
)

func Sta(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Path

	fmt.Println(file)
	_, err := os.ReadFile("../presentation" + file)
	if err != nil {
		
		return
	}

	http.ServeFile(w, r, "../presentation"+file)
}
