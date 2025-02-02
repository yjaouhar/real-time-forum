package router

import (
	"fmt"
	"net/http"
	"os"
	"real-time-forum/handler"
)

// Function dyal Router
func Router() *http.ServeMux {
	router := http.NewServeMux()

	// Routes
	router.HandleFunc("/", handler.First)

	// Serve static files (CSS + JS)
	router.Handle("/static/",  http.HandlerFunc(Sta))
	router.Handle("/javascript/", http.HandlerFunc(Sta))

	return router
}

func Sta(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Path
	// Check if the requested file exists by trying to read it
	fmt.Println(file)
	_, err := os.ReadFile("../presentation" + file)
	if err != nil {
		// fmt.Println(file)
		// Error(w, http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, "../presentation"+file)
}

// Function bach yrun server
func StartServer() error {
	router := Router()
	fmt.Println("✅ Server running on: http://localhost:8080")
	return http.ListenAndServe(":8080", router)
}
