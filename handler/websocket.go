package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
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
	Regester string `json:"regester"`
	Id       int
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	defer ws.Close()

	tocken := r.URL.Query().Get("token")
	id := db.GetId("sessionToken", tocken)
	username := db.GetUser(id)
	if db.HaveToken(tocken) {
		mutex.Lock()
		utils.Clients[username] = ws
		mutex.Unlock()
		broadcastUserStatus("user_status", strconv.Itoa(id), "online")
	}

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading message:", err)
			mutex.Lock()
			delete(utils.Clients, username)
			mutex.Unlock()
			broadcastUserStatus("user_status", strconv.Itoa(id), "offline")
			break
		}
		if msg.Regester == "true" {
			fmt.Println("regester")
			broadcastUserStatus("new_contact", "", "offline")
			continue
		}

		username := db.GetUser(db.GetId("sessionToken", msg.Token))

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
	if !servisse.CheckErr(w, r, "/querychat", "POST") {
		return
	}
	sr := 1
	nickname := r.FormValue("nickname")
	token := r.FormValue("token")
	first := r.FormValue("first")
	_, err := servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}
	if sr != 0 {
		user := db.GetUser(db.GetId("sessionToken", token))
		messge, err := db.QueryMessage(user, nickname, first)
		if err != nil {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"NoData":true}`))
			return
		}
		if len(messge) < 10 {
			sr = 0
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(messge)
	}
}

func broadcastUserStatus(typ, id, status string) {
	fmt.Println("Broadcasting user status")
	message := map[string]string{
		"type":   typ,
		"id":     id,
		"status": status,
	}
	for _, client := range utils.Clients {
		client.WriteJSON(message)
	}
}
