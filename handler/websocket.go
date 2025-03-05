package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"

	db "real-time-forum/Database/cration"
	"real-time-forum/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var mutex = sync.Mutex{}

type Message struct {
	Token    string `json:"token"`
	Nickname string `json:"username"`
	Message  string `json:"text"`
	Id       int
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}
	defer ws.Close()

	tocken := r.URL.Query().Get("token")
	// fmt.Println("tocken:", tocken)
	id := db.GetId("sessionToken", tocken)
	username := db.GetUser(id)
	if db.HaveToken(tocken) {
		mutex.Lock()
		utils.Clients[username] = ws
		mutex.Unlock()
		fmt.Println("........", utils.Clients)
		broadcastUserStatus("user_status", strconv.Itoa(id), "online")
	}
	for {
		// fmt.Println("Waiting for message")
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			mutex.Lock()
			delete(utils.Clients, username)
			mutex.Unlock()
			broadcastUserStatus("user_status", strconv.Itoa(id), "offline")
			break
		}

		username := db.GetUser(db.GetId("sessionToken", msg.Token))
		// fmt.Println("Message received:", msg, username)
		fmt.Println("0000000000000000")
		if utils.Clients[username] == nil {

			utils.Clients[username] = ws
			broadcastUserStatus("new_contact", strconv.Itoa(id), "online")
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

	for nikname, client := range utils.Clients {
		if nikname == msg.Nickname {

			msg.Nickname = username
			msg.Id = db.GetId("nikname", msg.Nickname)
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending message:", err)
				client.Close()
				delete(utils.Clients, nikname)
			}
			break
		}
	}
}

func QueryMsg(w http.ResponseWriter, r *http.Request) {
	sr := 1
	nickname := r.FormValue("nickname")
	token := r.FormValue("token")
	first := r.FormValue("first")
	if db.HaveToken(token) && sr != 0 {
		user := db.GetUser(db.GetId("sessionToken", token))
		messge, err := db.QueryMessage(user, nickname, first)
		if err != nil {
			fmt.Println("Error wer query message : ", err)
		}
		if len(messge) < 10 {
			sr = 0
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(messge)
	}
}

func broadcastUserStatus(typ, id, status string) {
	message := map[string]string{
		"type":   typ,
		"id":     id,
		"status": status,
	}
	for _, client := range utils.Clients {
		client.WriteJSON(message)
	}
}
