package handler

import (
	"fmt"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

var (
	sl []int
	ed = 0
	sr = 0
)

func Categore(w http.ResponseWriter, r *http.Request) {
	var err error

	_, err = servisse.IsHaveToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error": "Unauthorized", "status":false, "tocken":false}`))
		return
	}
	categories := []string{r.FormValue("categories")}
	fmt.Println("===> categories :", categories)
	err = servisse.CategoriesValidator(categories)
	if err != nil {
		fmt.Println("error categore :", err)
		return
	}
	sl, err = db.GetCategories(categories[0])

	// fmt.Println("===> categories :", sl)

	// token, _ := r.Cookie("SessionToken")
	// userid := db.GetId("sessionToken", token.Value)
}
