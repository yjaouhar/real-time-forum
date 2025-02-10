package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
	"real-time-forum/utils"
)

func Comments(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var err error
		idpost := utils.Jsncomment{}
		err = json.NewDecoder(r.Body).Decode(&idpost)
		id, err := strconv.Atoi(idpost.ID)
		if err != nil {
			fmt.Println("err jsn")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		w.Header().Set("Content-Type", "application/json")

		_, err = servisse.IsHaveToken(r)
		if err != nil {
			fmt.Println("token not found")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}
		token, _ := r.Cookie("SessionToken")
		userid := db.GetId("sessionToken", token.Value)
		allcoments, err := db.SelectComments(id, userid)
		if err != nil {
			fmt.Println("err select")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + err.Error() + `", "status":false}`))
			return
		}

		json.NewEncoder(w).Encode(allcoments)
	}
}

func Sendcomment(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

		var comment utils.Comment
		w.Header().Set("Content-Type", "application/json")
		_, ishave := servisse.IsHaveToken(r)
		if ishave != nil {
			fmt.Println("token not found")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"error": "` + ishave.Error() + `", "status":false, "tock":false}`))
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
}
