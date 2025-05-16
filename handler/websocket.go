package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"

	db "real-time-forum/Database"
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
		fmt.Printf("WebSocket upgrade failed: %v\n", err)
		http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
		return
	}
	defer ws.Close()

	tocken := r.URL.Query().Get("token")
	id := 0
	username := ""
	if db.HaveToken(tocken) {
		id = db.GetId("sessionToken", tocken)
		username = db.GetUser(id)
		mutex.Lock()
		utils.Clients[username] = append(utils.Clients[username], ws)
		mutex.Unlock()
		BroadcastUserStatus("user_status", strconv.Itoa(id), "online", username)
	} else {
		return
	}

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			if len(utils.Clients[username]) == 1 {
				mutex.Lock()
				delete(utils.Clients, username)
				mutex.Unlock()
				BroadcastUserStatus("user_status", strconv.Itoa(id), "offline", username)
			} else {
				for i, c := range utils.Clients[username] {
					if c == ws {
						mutex.Lock()
						utils.Clients[username] = append(utils.Clients[username][:i], utils.Clients[username][i+1:]...)
						mutex.Unlock()
						break
					}
				}
			}
			break
		}
		if len(msg.Message) > 1000 || len(msg.Message) < 1 || strings.ReplaceAll(msg.Message, "\n", "") == "" || strings.ReplaceAll(msg.Message, " ", "") == "" {
			ws.WriteJSON(map[string]string{
				"error":      "BadRequest",
				"StatusCode": "400",
			})
			continue
		}
		if !db.CheckInfo(msg.Nickname, "nikname") && db.HaveToken(msg.Token) {
			if _, exists := utils.Clients[msg.Nickname]; exists {
				err = db.InsertMessage(username, msg.Nickname, msg.Message)
				if err != nil {
					fmt.Println("Error inserting message in DB:", err)
					break
				}
				msg.Token = ""
				SendMessage(msg, username)
			} else {
				fmt.Println("Key ma kaynch!")
			}
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
			for _, clien := range client {
				err := clien.WriteJSON(msg)
				if err != nil {
					fmt.Println("Error sending message:", err)
					clien.Close()
					if len(utils.Clients[nikname]) == 1 {
						delete(utils.Clients, nikname)
					} else {
						for i, c := range utils.Clients[nikname] {
							if c == clien {
								utils.Clients[nikname] = append(utils.Clients[nikname][:i], utils.Clients[nikname][i+1:]...)
								break
							}
						}
					}
				}
			}
			break
		}
	}
}

func QueryMsg(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/querychat", "POST") {
		return
	}
	nickname := r.FormValue("nickname")
	token := r.FormValue("token")
	first := r.FormValue("first")
	sr := r.FormValue("id")
	id, err := strconv.Atoi(sr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "BadRequest", "StatusCode": 400})
		return
	}
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}

	user := db.GetUser(db.GetId("sessionToken", token))
	messge, err := db.QueryMessage(user, nickname, first, id)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"NoData":true}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(messge)
}

func BroadcastUserStatus(typ, id, status, username string) {
	message := map[string]string{
		"type":   typ,
		"id":     id,
		"status": status,
	}
	for key, client := range utils.Clients {
		if key != username {
			for _, conn := range client {
				err := conn.WriteJSON(message)
				if err != nil {
					conn.Close()
					if len(client) == 1 {
						mutex.Lock()
						delete(utils.Clients, id)
						mutex.Unlock()
					} else {
						for i, c := range client {
							if c == conn {
								mutex.Lock()
								client = append(client[:i], client[i+1:]...)
								mutex.Unlock()
								break
							}
						}
					}
				}
			}
		}
	}
}
