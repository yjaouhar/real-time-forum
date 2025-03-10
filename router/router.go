package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"real-time-forum/handler"
)

func Router() *http.ServeMux {
	router := http.NewServeMux()

	router.Handle("/", LimitRequest(http.HandlerFunc(handler.First)))
	router.Handle("/resgester", LimitRequest(http.HandlerFunc(handler.Register)))
	router.Handle("/login", LimitRequest(http.HandlerFunc(handler.Login)))
	router.Handle("/stuts", LimitRequest(http.HandlerFunc(handler.Stuts)))
	router.Handle("/pubpost", LimitRequest(http.HandlerFunc(handler.Post)))
	router.Handle("/static/", http.HandlerFunc(handler.Sta))
	router.Handle("/javascript/", http.HandlerFunc(handler.Sta))
	router.Handle("/getpost", LimitRequest(http.HandlerFunc(handler.Getpost)))
	router.Handle("/sendcomment", LimitRequest(http.HandlerFunc(handler.Sendcomment)))
	router.Handle("/getcomment", LimitRequest(http.HandlerFunc(handler.Comments)))
	router.Handle("/reactione", LimitRequest(http.HandlerFunc(handler.Reaction)))
	router.Handle("/logout", LimitRequest(http.HandlerFunc(handler.Logout)))
	router.Handle("/categories", LimitRequest(http.HandlerFunc(handler.Categore)))
	router.Handle("/getcontact", LimitRequest(http.HandlerFunc(handler.Contact)))
	router.Handle("/ws", LimitRequest(http.HandlerFunc(handler.HandleWebSocket)))
	router.Handle("/querychat", LimitRequest(http.HandlerFunc(handler.QueryMsg)))

	return router
}

func StartServer() error {
	router := Router()
	fmt.Println("✅ Server running on: http://localhost:8080")
	return http.ListenAndServe(":8080", router)
}

var (
	requestTimes sync.Map
	cont         sync.Map
)

func LimitRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		now := time.Now()

		lastRequestValue, lastExists := requestTimes.Load(ip)
		countValue, countExists := cont.Load(ip)
		count := 1
		if countExists {
			count = countValue.(int)
		}

		if lastExists {
			lastRequest := lastRequestValue.(time.Time)
			timeSinceLastRequest := now.Sub(lastRequest)

			if timeSinceLastRequest < time.Second {
				count++

				if count > 10 {
					if r.URL.Path == "/" {
						http.Error(w, "Too many requests", http.StatusTooManyRequests)
					} else {
						w.WriteHeader(http.StatusTooManyRequests)
						json.NewEncoder(w).Encode(map[string]interface{}{"request": "Too many requests"})
					}
					count = 1
					requestTimes.Store(ip, now)
					cont.Store(ip, count)
					return
				}
			} else {
				count = 1
			}
		}

		requestTimes.Store(ip, now)
		cont.Store(ip, count)

		next.ServeHTTP(w, r)
	})
}
