package handler

import (
	"fmt"
	"net/http"

	db "real-time-forum/Database/cration"
	"real-time-forum/servisse"
)

func Categore(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		categories := []string{r.FormValue("categories")}
		err := servisse.CategoriesValidator(categories)
		if err != nil {
			fmt.Println("error categore :", err)
			return
		}
		cat, err := db.GetCategories(categories[0])
		fmt.Println("==>", cat)

	}
}
