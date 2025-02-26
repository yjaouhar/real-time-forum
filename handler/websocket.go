package handler

import (
	"fmt"
	"net/http"
	db "real-time-forum/Database/cration"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var Clients = make(map[*websocket.Conn]bool)
var mutex = sync.Mutex{}

type Message struct {
	Token    string `json:"token"`
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
		fmt.Println("toooooken :", msg.Token)
		if db.HaveToken(msg.Token) {
		
			name := db.GetUser(db.GetId("sessionToken", msg.Token))
			if err != nil {
				fmt.Println("Error reading message:", err)
				mutex.Lock()
				delete(Clients, ws)
				mutex.Unlock()
				break
			}
			if !db.CheckInfo(msg.Nickname, "nikname") {
				fmt.Println("====> name :", name)
				_,err := db.QueryConnection(name, msg.Nickname)
				if err!=nil{
					err = db.InsertConnection(name, msg.Nickname)
				if err != nil {
					fmt.Println("Error to insert connection :",err)
					return
				}
				}else{
					fmt.Println("connection kayna yad")
				}
				

				err = db.InsertMessage(name, msg.Nickname, msg.Message)
				if err!=nil{
					fmt.Println("Errore for insert msg in db :",err)
				}

				HandleMessages(msg)
			}
		}

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
