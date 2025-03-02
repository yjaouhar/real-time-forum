package utils

import "fmt"

func Swap(sl []Messages) []Messages {
	slr := []Messages{}
	fmt.Println("=======> chat 1 :", sl)
	for i := len(sl) - 1; i >= 0; i-- {
		slr = append(slr, sl[i])
	}
	fmt.Println("=======> chat 2 :", slr)
	return slr
}
