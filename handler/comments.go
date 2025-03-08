package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	db "real-time-forum/Database/cration"
	Error "real-time-forum/Error"
	"real-time-forum/servisse"
	"real-time-forum/utils"
)

func Comments(w http.ResponseWriter, r *http.Request) {
	check := servisse.CheckErr(w, r, "/comments", "POST")
	if !check {
		return
	}
	var err error

	w.Header().Set("Content-Type", "application/json")
	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"token":false}`))
		return
	}

	idpost := utils.Jsncomment{}
	err = json.NewDecoder(r.Body).Decode(&idpost)
	if err != nil {
		message, statuscode := Error.Json(err)
		w.WriteHeader(statuscode)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": message , "StatusCode": statuscode})
		return
	}

	id, err := strconv.Atoi(idpost.ID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest) // 422
		json.NewEncoder(w).Encode(map[string]interface{}{ "error": "Bad request" , "StatusCode": 400})
		return
	}

	
	token, _ := r.Cookie("SessionToken")
	userid := db.GetId("sessionToken", token.Value)
	allcoments, err := db.SelectComments(id, userid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{ "error": "Internal server error" , "StatusCode": 500})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(allcoments)
}

func Sendcomment(w http.ResponseWriter, r *http.Request) {
		check := servisse.CheckErr(w, r, "/sendcomment", "POST")
		if !check {
			return
		}
		var comment utils.Comment
		w.Header().Set("Content-Type", "application/json")
		_, ishave := servisse.IsHaveToken(r)
		if ishave != nil {
			fmt.Println("token not found")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error": "` + ishave.Error() + `", "status":false, "tocken":false}`))
			return
		}
		tocken, _ := r.Cookie("SessionToken")
		id := db.GetId("sessionToken", tocken.Value)
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			fmt.Println("err jsn")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		postid, err := strconv.Atoi(comment.PostID)
		if err != nil {
			fmt.Println("err postid")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		err = db.SelectPostid(postid)
		if err != nil {
			fmt.Println("err postid")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		err = db.InsertComment(postid, id, comment.Content)
		if err != nil {
			fmt.Println("err insert", err)
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"error": "comment sent", "status":true}`))

		// code to create a post
	
}
