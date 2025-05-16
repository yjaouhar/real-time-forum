package main

import (
	"fmt"
	data "real-time-forum/Database"
	Ret "real-time-forum/router"
)

func main() {
	Db, err := data.Db()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer Db.Close()
	//	serv := http.NewServeMux()
	err = Ret.StartServer()
	if err != nil {
		return
	}

}
