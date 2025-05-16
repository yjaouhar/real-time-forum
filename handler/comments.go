package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	db "real-time-forum/Database"
	Error "real-time-forum/Error"
	"real-time-forum/servisse"
	"real-time-forum/utils"
)

func Comments(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/getcomment", "POST") {
		return
	}
	var err error

	w.Header().Set("Content-Type", "application/json")
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"tocken": false})
		return
	}

	idpost := utils.Jsncomment{}
	err = json.NewDecoder(r.Body).Decode(&idpost)
	if err != nil {
		message, statuscode := Error.Json(err)
		w.WriteHeader(statuscode)
		json.NewEncoder(w).Encode(map[string]any{"error": message, "StatusCode": statuscode})
		return
	}

	id, err := strconv.Atoi(idpost.ID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "Bad request", "StatusCode": 400})
		return
	}
	post_id := db.SelectPostid(id)
	if !post_id {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "Bad Request", "StatusCode": 400})
		return
	}
	token, _ := r.Cookie("SessionToken")
	userid := db.GetId("sessionToken", token.Value)
	allcoments, err := db.SelectComments(id, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"error": "Internal server error", "StatusCode": 500})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(allcoments)
}

func Sendcomment(w http.ResponseWriter, r *http.Request) {
	if !servisse.CheckErr(w, r, "/sendcomment", "POST") {
		return
	}
	var comment utils.Comment
	w.Header().Set("Content-Type", "application/json")
	_, ishave := servisse.IsHaveToken(r)
	if ishave != nil {

		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{"tocken": false})
		return
	}
	tocken, _ := r.Cookie("SessionToken")
	id := db.GetId("sessionToken", tocken.Value)
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		message, statuscode := Error.Json(err)
		w.WriteHeader(statuscode)
		json.NewEncoder(w).Encode(map[string]any{"error": message, "StatusCode": statuscode})
		return
	}
	postid, err := strconv.Atoi(comment.PostID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "Bad Request", "StatusCode": 400})
		return
	}
	post_id := db.SelectPostid(postid)
	if !post_id {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "Bad Request", "StatusCode": 400})
		return
	}
	err = db.InsertComment(postid, id, comment.Content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"error": "Internal Server Error", "StatusCode": 500})
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":true}`))
}
