package auth

import (
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
)

func Register(mux *http.ServeMux, database db.Db) {
	mux.HandleFunc("GET /auth/validate", HandleValidate(database))
}

const AuthCookie = "Authorization"
