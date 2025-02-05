package router

import (
	"fmt"
	"net/http"

	"real-time-forum/handler"
)

// Function dyal Router
func Router() *http.ServeMux {
	router := http.NewServeMux()


	router.HandleFunc("/", handler.First)
	router.HandleFunc("/resgester", handler.Register)
	router.HandleFunc("/login", handler.Login)
	router.HandleFunc("/stuts", handler.Stuts)

	router.Handle("/static/", http.HandlerFunc(handler.Sta))
	router.Handle("/javascript/", http.HandlerFunc(handler.Sta))


	return router
}

// Function bach yrun server
func StartServer() error {
	router := Router()
	fmt.Println("✅ Server running on: http://localhost:8080")
	return http.ListenAndServe(":8080", router)
}
