package auth

import (
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
)

func Register(mux *http.ServeMux, database db.Db) {
	mux.HandleFunc("GET /auth/validate", HandleValidate(database))
	mux.HandleFunc("GET /auth/login", HandleLogin)
	mux.HandleFunc("POST /auth/callback", HandleCallback(database))
	mux.HandleFunc("GET /auth/logout", HandleLogout(database))
}

// If the key is empty string it will remove the cookie
func CreateAuthCookie(sessionKey string) *http.Cookie {
	cookie := &http.Cookie{
		Name:     httputils.AuthCookie,
		Secure:   !httputils.IsTestMode(),
		HttpOnly: true,
		MaxAge:   3600,
		Path:     "/",
		Value:    sessionKey,
	}

	if sessionKey == "" {
		cookie.MaxAge = 0
	}

	return cookie
}
