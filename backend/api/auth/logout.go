package auth

import (
	"log/slog"
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
)

// swagger:route GET /auth/logout auth getLogout
//
// Summary: Logout admin user
//
// Description: Logs out current admin user, invalidates session key, clears auth cookie, and redirects to root.
//
// Responses:
//
//	307: description: Temporary Redirect
func HandleLogout(db db.Db) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, CreateAuthCookie(""))

		cookie, err := r.Cookie(AuthCookie)
		if err == nil {
			user, err := model.AdminGetFromSessionKey(db, cookie.Value)
			if err == nil {
				err = model.AdminLogout(db, user.Id)
				if err != nil {
					slog.Error("Could not log out user", "err", err)
				} else {
					slog.Info("Logged user out", "id", user.Id, "name", user.Name)
				}
			}
		}

		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	}
}
