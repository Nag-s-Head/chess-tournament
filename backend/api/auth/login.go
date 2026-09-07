package auth

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	githubapi "github.com/Nag-s-Head/chess-tournament/backend/lib/github_api"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var oauthConfig *oauth2.Config

func init() {
	baseURL := os.Getenv("FRONTEND_EXTERNAL_BASE_URL")
	if baseURL == "" {
		baseURL = os.Getenv("APP_BASE_URL")
	}
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_CLIENT_SECRET"),
		Endpoint:     github.Endpoint,
		RedirectURL:  fmt.Sprintf("%s/auth/callback", baseURL),
		Scopes:       []string{"read:user", "read:org"},
	}
}

// swagger:route GET /auth/login auth getLogin
//
// Summary: Initiate OAuth login
//
// Description: Redirects client to GitHub OAuth authentication or test-mode page.
//
// Responses:
//
//	307: description: Temporary Redirect
func AuthUrl() string {
	if isTestMode() {
		return "/admin/test-mode"
	}
	if oauthConfig != nil {
		return oauthConfig.AuthCodeURL("state")
	}
	return "https://github.com/login/oauth/authorize"
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, AuthUrl(), http.StatusTemporaryRedirect)
}

// swagger:route GET /auth/callback auth getCallback
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
//	307: description: Temporary Redirect
//	400: description: Bad Request
//	403: description: Forbidden
//	500: description: Internal Error
func HandleCallback(database db.Db) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code := r.URL.Query().Get("code")
		if isTestMode() {
			switch code {
			case "valid":
				adminUser, err := model.AdminLogin(database, "Test Admin", "testadmin", model.GetRemoteAddr(r), r.UserAgent())
				if err != nil {
					http.Error(w, "Database error", http.StatusInternalServerError)
					return
				}
				http.SetCookie(w, CreateAuthCookie(adminUser.SessionKey))
			}
		} else {
			if code == "" {
				slog.Error("No code in github callback")
				http.Redirect(w, r, "/auth-error?reason=no_code", http.StatusTemporaryRedirect)
				return
			}

			token, err := oauthConfig.Exchange(context.Background(), code)
			if err != nil {
				slog.Error("Could not exchange code for token", "err", err)
				http.Redirect(w, r, "/auth-error?reason=token_exchange", http.StatusTemporaryRedirect)
				return
			}

			ghUser, err := githubapi.GetAuthenticatedUser(token.AccessToken)
			if err != nil {
				slog.Error("Could not get authenticated user from Github", "err", err)
				http.Redirect(w, r, "/auth-error?reason=user_info", http.StatusTemporaryRedirect)
				return
			}

			orgName := os.Getenv("GITHUB_ORGANISATION")
			apiKey := os.Getenv("GITHUB_API_KEY")

			isMember, err := githubapi.IsMemberOfOrg(orgName, ghUser.Login, apiKey)
			if err != nil {
				slog.Error("Could not check org membership", "err", err, "org", orgName, "user", ghUser.Login)
				http.Redirect(w, r, "/auth-error?reason=org_check", http.StatusTemporaryRedirect)
				return
			}

			if !isMember {
				slog.Warn("User is not a member of the required organisation", "user", ghUser.Login, "org", orgName)
				http.Redirect(w, r, "/auth-error?reason=not_member", http.StatusTemporaryRedirect)
				return
			}

			// Login successful, create or update admin user in DB
			adminUser, err := model.AdminLogin(database, ghUser.Name, ghUser.Login, model.GetRemoteAddr(r), r.UserAgent())
			if err != nil {
				slog.Error("Could not login admin user in database", "err", err)
				http.Redirect(w, r, "/auth-error?reason=db_error", http.StatusTemporaryRedirect)
				return
			}

			http.SetCookie(w, CreateAuthCookie(adminUser.SessionKey))
			http.Redirect(w, r, "/admin", http.StatusTemporaryRedirect)
		}
	}
}
