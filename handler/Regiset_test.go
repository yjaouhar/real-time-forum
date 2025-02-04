package handler_test

import(
	"net/http"
	"real-time-forum/handler"
	"testing"
)

func TestRegister(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		w http.ResponseWriter
		r *http.Request
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler.Register(tt.w, tt.r)
		})
	}
}
