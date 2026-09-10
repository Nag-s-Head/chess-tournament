package auth

import (
	"log/slog"
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
)

// Success response for validate endpoint
// swagger:response validateResponse
type validateResponseWrapper struct {
	// in:body
	Body ValidateResponse
}

// swagger:model
type ValidateResponse struct {
	Valid bool   `json:"valid"`
	Url   string `json:"url,omitempty"`
}

// swagger:route GET /auth/validate auth getValidate
//
// Summary: Validate session or token of an admin
//
// Description: Validates the admin session key via cookie or Authorization Bearer header.
//
// Produces:
// - application/json
//
// Responses:
//
//	200: validateResponse
func HandleValidate(database db.Db) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		token := getSessionToken(r)
		if token == "" {
			httputils.WriteJson(w, ValidateResponse{
				Valid: false,
				Url:   AuthUrl(),
			})
			return
		}

		_, err := model.AdminGetFromSessionKey(database, token)
		if err != nil {
			slog.Warn("User tried to connect with invalid session token", "err", err)
			httputils.WriteJson(w, ValidateResponse{
				Valid: false,
				Url:   AuthUrl(),
			})
			return
		}

		httputils.WriteJson(w, ValidateResponse{
			Valid: true,
		})
	}
}

func getSessionToken(r *http.Request) string {
	if cookie, err := r.Cookie(AuthCookie); err == nil && cookie.Value != "" {
		return cookie.Value
	}
	return ""
}
