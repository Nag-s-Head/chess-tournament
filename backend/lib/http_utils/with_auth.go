package httputils

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
)

const AuthCookie = "auth_token"

func FrontendLoginUrl() string {
	if IsTestMode() {
		return "/auth/test-mode"
	}

	return "/auth/login"
}

func IsTestMode() bool {
	return os.Getenv("TEST_MODE") == "true"
}

func WithAuthentication(db db.Db, next func(*model.AdminUser, slog.Logger) func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(AuthCookie)
		if err != nil {
			slog.Info("A user has tried to access the admin portal without being logged in, redirecting to authentication page")
			http.Redirect(w, r, FrontendLoginUrl(), http.StatusTemporaryRedirect)
			return
		}

		user, err := model.AdminGetFromSessionKey(db, cookie.Value)
		if err != nil {
			slog.Warn("User with invalid authentication tried to access the page", "url", r.URL, "err", err)
			http.Redirect(w, r, FrontendLoginUrl(), http.StatusTemporaryRedirect)
			return
		}
		next(user, *slog.With("admin_id", user.Id, "admin_name", user.Name))(w, r)
	}
}
