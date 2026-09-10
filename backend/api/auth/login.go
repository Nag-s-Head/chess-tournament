package auth

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var oauthConfig *oauth2.Config

func init() {
	baseURL := os.Getenv("FRONTEND_EXTERNAL_BASE_URL")
	if baseURL == "" {
		slog.Warn("FRONTEND_EXTERNAL_BASE_URL is not set, defaulting to APP_BASE_URL which is likely to fail")
		baseURL = os.Getenv("APP_BASE_URL")
	}
	if baseURL == "" {
		slog.Error("APP_BASE_URL is not set, defaulting to localhost")
		baseURL = "http://localhost:3000"
	}

	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_CLIENT_SECRET"),
		Endpoint:     github.Endpoint,
		RedirectURL:  fmt.Sprintf("%s/auth/callback", baseURL),
		Scopes:       []string{"read:user", "read:org"},
	}
}

// Success response for login endpoint
// swagger:response loginResponse
type loginResponseWrapper struct {
	// in: body
	Body LoginResponse
}

// swagger:model
type LoginResponse struct {
	Url string `json:"url"`
}

func AuthUrl() string {
	if isTestMode() {
		return "/auth/test-mode"
	}
	if oauthConfig != nil {
		return oauthConfig.AuthCodeURL("state")
	}

	slog.Warn("OAuth is not configured correctly, a frontend error URL was returned")
	return "/auth/error?reason=db_error"
}

// swagger:route GET /auth/login auth getLogin
//
// Summary: Initiate OAuth login
//
// Description: Redirects client to GitHub OAuth authentication or test-mode page.
//
// Produces:
// - application/json
//
// Responses:
//
//	200: loginResponse
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	httputils.WriteJson(w, LoginResponse{
		Url: AuthUrl(),
	})
}
