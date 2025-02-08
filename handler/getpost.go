package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/utils"
)

var (
	count int
	str   int
)

func Getpost(w http.ResponseWriter, r *http.Request) {
	var err error
	w.Header().Set("Content-Type", "application/json")
	// nb, err := strconv.Atoi(r.FormValue("namber"))
	// if err != nil {
	// 	fmt.Println("error f nb :", err)
	// 	return
	// }
	utils.LastId, err = db.Getlastid()
	if err != nil {
		fmt.Println("-------")
		return
	}

	if count == 0 {
		str = utils.LastId
		count++
	}
	// end := utils.LastId - nb

	Postes, err := db.GetPostes()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal ServerError", "status":false}`))
		return
	}
	// str = end
	// fmt.Println("=> ", str, "==>", end)

	fmt.Println("->", Postes)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Postes)
}
