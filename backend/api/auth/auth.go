package auth

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
)

func Register(mux *http.ServeMux, database db.Db) {
	mux.HandleFunc("GET /auth/validate", HandleValidate(database))
	mux.HandleFunc("GET /auth/login", HandleLogin)
	mux.HandleFunc("GET /auth/callback", HandleCallback(database))
	mux.HandleFunc("GET /auth/logout", HandleLogout(database))
	mux.HandleFunc("GET /auth/test-login", HandleTestLogin(database))
}

const AuthCookie = "admin-authentication"

func isTestMode() bool {
	return os.Getenv("TEST_MODE") == "true"
}

// If the key is empty string it will remove the cookie
func CreateAuthCookie(sessionKey string) *http.Cookie {
	cookie := &http.Cookie{
		Name:     AuthCookie,
		Secure:   !isTestMode(),
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

func loginUrl() string {
	if isTestMode() {
		return "/admin/test-mode"
	}

	return "/login"
}

func WithAuthentication(db db.Db, next func(*model.AdminUser) func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(AuthCookie)
		if err != nil {
			slog.Info("A user has tried to access the admin portal without being logged in, redirecting to authentication page")

			http.Redirect(w, r, loginUrl(), http.StatusTemporaryRedirect)
			return
		}

		user, err := model.AdminGetFromSessionKey(db, cookie.Value)
		if err != nil {
			slog.Warn("User with invalid authentication tried to access the page", "url", r.URL, "err", err)

			http.SetCookie(w, CreateAuthCookie(""))
			http.Redirect(w, r, loginUrl(), http.StatusTemporaryRedirect)
			return
		}
		next(user)(w, r)
	}
}
