package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

type reac struct {
	User_id        int
	Content_type   string `json:"content_type"`
	Content_id     string `json:"content_id"`
	Reactione_type string `json:"reaction_type"`
}

func Reaction(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var reactione reac
		err := json.NewDecoder(r.Body).Decode(&reactione)
		if err != nil {
			fmt.Println("error : ", err)
			return
		}
		_, err = servisse.IsHaveToken(r)
		if err != nil {
			fmt.Println("error : ", err)
			return
		}
		token, _ := r.Cookie("SessionToken")
		reactione.User_id = db.GetId("sessionToken", token.Value)
		content_id, err := strconv.Atoi(reactione.Content_id)
		if err != nil {
			fmt.Println("error : ", err)
			return
		}
		reactiontype, err := db.GetReactionRow(reactione.User_id, content_id)
		if err != nil {
			err = db.InsertReaction(reactione.User_id, content_id, reactione.Content_type, reactione.Reactione_type)
			if err != nil {
				fmt.Println("err select 1")
				return
			}
		}
		if reactiontype == reactione.Reactione_type {
			err = db.DeleteReaction(reactione.User_id, content_id)
			if err != nil {
				fmt.Println("err select 2")
				return
			}
		} else {
			err = db.Update(reactione.User_id, content_id, reactione.Reactione_type)
			if err != nil {
				fmt.Println("err select 3")
				return
			}
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"error": "Login successful", "status":true}`))
		// json.NewEncoder(w).Encode()
	}
}
