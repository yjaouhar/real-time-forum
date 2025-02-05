package db

func CreateTable() error {
	// Code to create a table
	tables := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		gender TEXT NOT NULL,
		age INTEGER NOT NULL,
		nikname TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		sessionToken TEXT
	);
	
	CREATE TABLE IF NOT EXISTS posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);
`

	_, err := DB.Exec(tables)
	if err != nil {
		// fmt.Println(err)
		return err
	}
	// fmt.Println("Table created successfully")
	return nil
}
