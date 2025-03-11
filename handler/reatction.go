package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"

	db "real-time-forum/Database/cration"
	Error "real-time-forum/Error"
	"real-time-forum/servisse"
)

type reac struct {
	User_id        int
	Content_type   string `json:"content_type"`
	Content_id     string `json:"content_id"`
	Reactione_type string `json:"reaction_type"`
}

var Mutex sync.Mutex

func Reaction(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/reactione", "POST") {
		return
	}

	var reactione reac

	err := json.NewDecoder(r.Body).Decode(&reactione)
	if err != nil {
		message, statuscode := Error.Json(err)
		w.WriteHeader(statuscode)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": message, "StatusCode": statuscode})
		return
	}
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"tocken":false}`))
		return
	}
	token, _ := r.Cookie("SessionToken")
	reactione.User_id = db.GetId("sessionToken", token.Value)
	content_id, err := strconv.Atoi(reactione.Content_id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Bad Request", "StatusCode": http.StatusBadRequest})
		return
	}

	if !db.CheckContentid(content_id, reactione.Content_type) {

		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Bad Request", "StatusCode": http.StatusBadRequest})
		return
	}
	Mutex.Lock()
	defer Mutex.Unlock()

	reactiontype, err := db.GetReactionRow(reactione.User_id, content_id)
	if err != nil {
		err = db.InsertReaction(reactione.User_id, content_id, reactione.Content_type, reactione.Reactione_type)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"error": "Internal Server Error", "StatusCode": http.StatusInternalServerError})
			return
		}
	}
	if reactiontype == reactione.Reactione_type {
		err = db.DeleteReaction(reactione.User_id, content_id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"error": "Internal Server Error", "StatusCode": http.StatusInternalServerError})
			return
		}
	} else {
		err = db.Update(reactione.User_id, content_id, reactione.Reactione_type)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"error": "Internal Server Error", "StatusCode": http.StatusInternalServerError})
			return
		}
	}

	sl, err := db.SelecReaction(content_id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Internal Server Error", "StatusCode": http.StatusInternalServerError})
		return
	}
	like, dislike, contenttype := db.Liklength(sl, reactione.User_id)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{ "status":true , "like":"` + strconv.Itoa(like) + `", "dislike":"` + strconv.Itoa(dislike) + `", "content_type":"` + contenttype + `"}`))
}
