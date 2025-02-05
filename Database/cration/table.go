package db

func CreateTable() error {
	// Code to create a table
	tables := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			first_name TEXT NOT NULL,
			last_name TEXT NOT NULL,
			email TEXT NOT NULL,
			gender TEXT NOT NULL,
			age INTEGER NOT NULL,
			nikname TEXT NOT NULL,
			password TEXT NOT NULL,
			sessionToken TEXT,
 		)`
	_, err := DB.Exec(tables)
	if err != nil {
		// fmt.Println(err)
		return err
	}
	// fmt.Println("Table created successfully")
	return nil
}
