package auth

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	githubapi "github.com/Nag-s-Head/chess-tournament/backend/lib/github_api"
	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
)

// Success response for callback endpoint
// swagger:response callbackResponse
type callbackResponseWrapper struct {
	// in: body
	Body CallbackResponse
}

// swagger:model
type CallbackResponse struct {
	Valid bool   `json:"valid"`
	Url   string `json:"url,omitempty"`
	Token string `json:"token"`
}

// swagger:route POST /auth/callback auth postCallback
//
// Summary: OAuth callback endpoint
//
// Description: Receives OAuth code, verifies GitHub org membership, creates session, and redirects to admin.
//
// Parameters:
//   - name: code
//     in: query
//     description: Authorization code from GitHub
//     required: true
//     type: string
//
// Responses:
//
//	200: callbackResponse
func HandleCallback(database db.Db) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code := r.URL.Query().Get("code")
		if isTestMode() {
			slog.Warn("Test mode is enabled, using mocked callback codes")
			switch code {
			case "valid":
				adminUser, err := model.AdminLogin(database, "Test Admin", "testadmin", model.GetRemoteAddr(r), r.UserAgent())
				if err != nil {
					http.Error(w, "Database error", http.StatusInternalServerError)
					return
				}
				httputils.WriteJson(w, CallbackResponse{
					Valid: true,
					Url:   "/admin",
					Token: adminUser.SessionKey,
				})
			}
		} else {
			if code == "" {
				slog.Error("No code in github callback")
				httputils.WriteJson(w, CallbackResponse{
					Valid: false,
					Url:   "/auth/error?reason=no_code",
				})
				return
			}

			token, err := oauthConfig.Exchange(context.Background(), code)
			if err != nil {
				http.Redirect(w, r, "", http.StatusTemporaryRedirect)
				httputils.WriteJson(w, CallbackResponse{
					Valid: false,
					Url:   "/auth/error?reason=token_exchange",
				})
				return
			}

			ghUser, err := githubapi.GetAuthenticatedUser(token.AccessToken)
			if err != nil {
				slog.Error("Could not get authenticated user from Github", "err", err)
				httputils.WriteJson(w, CallbackResponse{
					Valid: false,
					Url:   "/auth/error?reason=user_info",
				})
				return
			}

			orgName := os.Getenv("GITHUB_ORGANISATION")
			apiKey := os.Getenv("GITHUB_API_KEY")

			isMember, err := githubapi.IsMemberOfOrg(orgName, ghUser.Login, apiKey)
			if err != nil {
				slog.Error("Could not check org membership", "err", err, "org", orgName, "user", ghUser.Login)
				httputils.WriteJson(w, CallbackResponse{
					Valid: false,
					Url:   "/auth/error?reason=org_check",
				})
				return
			}

			if !isMember {
				slog.Warn("User is not a member of the required organisation", "user", ghUser.Login, "org", orgName)
				httputils.WriteJson(w, CallbackResponse{
					Valid: false,
					Url:   "/auth/error?reason=not_member",
				})
				return
			}

			// Login successful, create or update admin user in DB
			adminUser, err := model.AdminLogin(database, ghUser.Name, ghUser.Login, model.GetRemoteAddr(r), r.UserAgent())
			if err != nil {
				slog.Error("Could not login admin user in database", "err", err)
				httputils.WriteJson(w, CallbackResponse{
					Valid: false,
					Url:   "/auth/error?reason=db_error",
				})
				return
			}

			httputils.WriteJson(w, CallbackResponse{
				Valid: true,
				Url:   "/admin",
				Token: adminUser.SessionKey,
			})
		}
	}
}
