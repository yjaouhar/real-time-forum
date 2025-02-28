package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	db "real-time-forum/Database/cration"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var Clients = make(map[string]*websocket.Conn)
var mutex = sync.Mutex{}

type Message struct {
	Token    string `json:"token"`
	Nickname string `json:"username"`
	Message  string `json:"text"`
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}
	defer ws.Close()

	var firstMsg Message
	err = ws.ReadJSON(&firstMsg)
	if err != nil {
		fmt.Println("Error reading first message:", err)
		return
	}

	if !db.HaveToken(firstMsg.Token) {
		fmt.Println("Invalid token")
		return
	}

	username := db.GetUser(db.GetId("sessionToken", firstMsg.Token))

	mutex.Lock()
	Clients[username] = ws
	mutex.Unlock()

	fmt.Println("Connected user:", username)

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading message:", err)
			mutex.Lock()
			delete(Clients, username)
			mutex.Unlock()
			break
		}
		if !db.CheckInfo(msg.Nickname, "nikname") && db.HaveToken(msg.Token) {

			err = db.InsertMessage(username, msg.Nickname, msg.Message)
			if err != nil {
				fmt.Println("Error inserting message in DB:", err)
			}
			SendMessage(msg)
		}
	}
}

func SendMessage(msg Message) {
	mutex.Lock()
	defer mutex.Unlock()

	for nikname, client := range Clients {
		if nikname == msg.Nickname {
			fmt.Println("==> nikname :", nikname)
			err := client.WriteJSON(msg.Message)
			if err != nil {
				fmt.Println("Error sending message:", err)
				client.Close()
				delete(Clients, nikname)
			}
		}

	}
}

func QueryMsg(w http.ResponseWriter, r *http.Request) {
	nickname := r.FormValue("nickname")
	token := r.FormValue("token")
	if db.HaveToken(token) {
		user := db.GetUser(db.GetId("sessionToken", token))
		messge, err := db.QueryMessage(user, nickname)
		if err != nil {
			fmt.Println("Error wer query message")
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(messge)
	}
}
