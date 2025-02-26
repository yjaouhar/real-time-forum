package handler

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var Clients = make(map[*websocket.Conn]bool)
var mutex = sync.Mutex{}

type Message struct {
	ID       string    `json:"id"`
	Nickname string `json:"username"`
	Message  string `json:"text"`
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}
	defer ws.Close()

	mutex.Lock()
	Clients[ws] = true
	mutex.Unlock()

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading message:", err)
			mutex.Lock()
			delete(Clients, ws)
			mutex.Unlock()
			break
		}
		fmt.Println("Message received:", msg)
		HandleMessages(msg)
	}
}

func HandleMessages(msg Message) {
	mutex.Lock()
	defer mutex.Unlock()

	for client := range Clients {
		err := client.WriteJSON(msg)
		if err != nil {
			fmt.Println("Error sending message:", err)
			client.Close()
			delete(Clients, client)
		}
	}
}
