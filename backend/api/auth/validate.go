package auth

import (
	"log/slog"
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
	testmode "github.com/Nag-s-Head/chess-tournament/backend/test_mode"
)

// Success response for the health check
// swagger:response validateResponse
type validateResponseWrapper struct {
	// in: body
	Body ValidateResponse
}

type ValidateResponse struct {
	Valid bool `json:"valid"`
	// Where the client should be sent for OAuth2 authentiction.
	RedirectUrl string `json:"redirect_url"`
}

// swagger:route GET /auth.validate auth getValidate
//
// Summary: Validate a bearer token of an admin
//
// Description: Validate a bearer token of an admin, make sure the Authorization header is passed to this from the frontend
//
// Produces:
// - application/json
//
// Responses:
//
//	200: validateResponse
func HandleValidate(database db.Db) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		authCookie := r.CookiesNamed(AuthCookie)
		if len(authCookie) != 1 {
			if testmode.IsTestMode() {
				httputils.WriteJson(w, ValidateResponse{
					Valid:       false,
					RedirectUrl: "/admin/test-mode",
				})
			} else {
				// TODO: redirect to the OAuth2 URL
			}
		} else {
			sessionToken := authCookie[0].Value
			_, err := model.AdminGetFromSessionKey(database, sessionToken)
			if err != nil {
				slog.Warn("User has tried to connect with an invalid session token")
				httputils.WriteJson(w, ValidateResponse{
					Valid:       false,
					RedirectUrl: "", // TODO: read from env vars
				})
			} else {
				httputils.WriteJson(w, ValidateResponse{
					Valid: true,
				})
			}
		}
	}
}
