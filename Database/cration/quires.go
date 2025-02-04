package db

func Insertuser(first_name string, last_name string, email string, gender string, age int, nikname string, password string) error {
	infiuser, err := DB.Prepare("INSERT INTO users (first_name, last_name, email, gender, age, nikname, password) VALUES (?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	_, err = infiuser.Exec(first_name, last_name, email, gender, age, nikname, password)
	if err != nil {
		return err
	}
	return nil
}
