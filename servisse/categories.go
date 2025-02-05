package servisse

import (
	"errors"
	"strings"
)

func CategoriesValidator(categories []string) error {
	istruecat := false

	if len(categories) == 0 || len(categories) > 7 {
		return errors.New("invalid category! ")
	}

	TrueCategories := []string{"Tech Support", "General Discussion", "Tutorials", "Announcements", "Gaming", "Job Listings", "Hobbies & Interests"}
	for _, category := range categories {
		bool := false
		for _, truecat := range TrueCategories {
			if strings.EqualFold(category, truecat) {
				bool = true
				istruecat = true
				break
			}
		}
		if !bool {
			return errors.New("invalid category! ")
		}

	}
	if !istruecat {
		return errors.New("invalid category! ")
	}
	return nil
}
