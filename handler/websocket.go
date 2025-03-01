package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	db "real-time-forum/Database/cration"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var (
	Clients = make(map[string]*websocket.Conn)
	mutex   = sync.Mutex{}
)

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

	tocken := r.URL.Query().Get("token")
	fmt.Println("tocken:", tocken)

	username := db.GetUser(db.GetId("sessionToken", tocken))
	if db.HaveToken(tocken) {
		mutex.Lock()
		Clients[username] = ws
		mutex.Unlock()
	}
	for {
		fmt.Println("Waiting for message")
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading message:", err)
			mutex.Lock()
			delete(Clients, username)
			mutex.Unlock()
			break
		}
		
		username := db.GetUser(db.GetId("sessionToken", msg.Token))
		fmt.Println("Message received:", msg , username)
		if Clients[username] == nil {
			Clients[username] = ws
		}
		if msg.Nickname == "" && msg.Message == "" {
			fmt.Println("no message")
			continue
		}
		if !db.CheckInfo(msg.Nickname, "nikname") && db.HaveToken(msg.Token) {

			err = db.InsertMessage(username, msg.Nickname, msg.Message)
			if err != nil {
				fmt.Println("Error inserting message in DB:", err)
			}

			msg.Token = ""
			SendMessage(msg, username)
		}
	}
}

func SendMessage(msg Message, username string) {
	mutex.Lock()
	defer mutex.Unlock()

	for nikname, client := range Clients {
		if nikname == msg.Nickname {
			msg.Nickname = username
			fmt.Println("==> nikname :", nikname)
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending message:", err)
				client.Close()
				delete(Clients, nikname)
			}
			break
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
