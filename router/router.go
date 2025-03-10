package router

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"real-time-forum/handler"
)

// Function dyal Router
func Router() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("/", handler.First)
	router.HandleFunc("/resgester", handler.Register)
	router.HandleFunc("/login", handler.Login)
	router.HandleFunc("/stuts", handler.Stuts)
	router.HandleFunc("/pubpost", handler.Post)
	router.Handle("/static/", http.HandlerFunc(handler.Sta))
	router.Handle("/javascript/", http.HandlerFunc(handler.Sta))
	router.HandleFunc("/getpost", handler.Getpost)
	router.HandleFunc("/sendcomment", handler.Sendcomment)
	router.HandleFunc("/getcomment", handler.Comments)
	router.HandleFunc("/reactione", handler.Reaction)
	router.HandleFunc("/logout", handler.Logout)
	router.HandleFunc("/categories", handler.Categore)
	router.HandleFunc("/getcontact", handler.Contact)
	router.HandleFunc("/ws", handler.HandleWebSocket)
	router.HandleFunc("/querychat", handler.QueryMsg)

	return router
}

// Function bach yrun server
func StartServer() error {
	router := Router()
	fmt.Println("✅ Server running on: http://localhost:8080")
	return http.ListenAndServe(":8080", router)
}

var Time sync.Map

func LimitRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		now := time.Now()

		lastRequest, exists := Time.Load(ip)

		if exists {
			if now.Sub(lastRequest.(time.Time)) < 500 * time.Millisecond {
				http.Error(w, "Too many requests", http.StatusTooManyRequests)
				return
			}
		}

		Time.Store(ip, now)

		next.ServeHTTP(w, r)
	})
}
