package main

import (
	data "real-time-forum/Database/cration"
	Ret "real-time-forum/router"
)

func main() {
	Db, err := data.Db()
	if err != nil {
		return
	}
	defer Db.Close()
	//	serv := http.NewServeMux()
	err = Ret.StartServer()
	if err != nil {
		return
	}

}
