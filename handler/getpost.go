package handler

import (
	"encoding/json"
	"net/http"

	db "real-time-forum/Database/cration"
)

var (
	end = 0
	str = 0
)

func Getpost(w http.ResponseWriter, r *http.Request) {
	var err error
	w.Header().Set("Content-Type", "application/json")
	lastdata := r.FormValue("lastdata")

	if lastdata == "true" {
		str, err = db.Getlastid()
		if err != nil {
			return
		}
		lastdata = "false"
	}
	if str == 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"finish": true}`))
		return
	}

	if str > 10 {
		end = str - 10
	} else if str < 10 {
		end = 0
	}

	Postes, err := db.GetPostes(str, end)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if end-10 >= 0 {
		str = end
		end -= 10
	} else {
		str = end
		end = 0
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Postes)
}
