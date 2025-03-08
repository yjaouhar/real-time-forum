package error

import (
	"encoding/json"
	"net/http"
)

func Json(err error) (string, int) {
	var errMsg string
	var statusCode int
	switch err.(type) {
	case *json.SyntaxError:
		statusCode = http.StatusBadRequest // 400
		errMsg = "Bade request."
	case *json.UnmarshalTypeError:
		statusCode = http.StatusUnprocessableEntity // 422
		errMsg = "Unprocessable entity."
	default:
		statusCode = http.StatusBadRequest // 400
		errMsg = "Bade request."
	}
	return errMsg, statusCode
}
