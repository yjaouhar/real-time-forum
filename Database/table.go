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
		expiry TIMESTAMP,
		sessionToken TEXT
	);
	
	CREATE TABLE IF NOT EXISTS postes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		categories TEXT NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		post_id INTEGER NOT NULL,
		category TEXT NOT NULL,
		FOREIGN KEY (post_id) REFERENCES postes(id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS comments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		post_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL,
		comment TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (post_id) REFERENCES postes(id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	connection_id INTEGER NOT NULL,  
    sender_id TEXT NOT NULL,            
    receiver_id TEXT NOT NULL,          
    message TEXT NOT NULL,                 
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (connection_id) REFERENCES connection(id),            
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
	CREATE TABLE IF NOT EXISTS connection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    user_1 TEXT NOT NULL,            
    user_2 TEXT NOT NULL,                      
    FOREIGN KEY (user_1) REFERENCES users(id),
    FOREIGN KEY (user_2) REFERENCES users(id)
);
`

	_, err := DB.Exec(tables)
	if err != nil {
		return err
	}
	return nil
}
