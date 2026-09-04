package auth_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Nag-s-Head/chess-tournament/backend/api/auth"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/db/test_utils"
	"github.com/stretchr/testify/require"
)

func TestWithAuthentication(t *testing.T) {
	db := testutils.GetDb(t)
	defer db.Close()

	dummyHandler := func(user *model.AdminUser) func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("hello " + user.Name))
		}
	}

	t.Run("No cookie redirects", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/protected", nil)
		rr := httptest.NewRecorder()

		handler := auth.WithAuthentication(db, dummyHandler)
		handler(rr, req)

		require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
		require.NotEmpty(t, rr.Header().Get("Location"))
	})

	t.Run("Invalid session key redirects and clears cookie", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/protected", nil)
		req.AddCookie(&http.Cookie{
			Name:  auth.AuthCookie,
			Value: "bad-session-key",
		})
		rr := httptest.NewRecorder()

		handler := auth.WithAuthentication(db, dummyHandler)
		handler(rr, req)

		require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
		setCookie := rr.Header().Get("Set-Cookie")
		require.Contains(t, setCookie, auth.AuthCookie)
	})

	t.Run("Valid session key succeeds", func(t *testing.T) {
		user, err := model.AdminLogin(db, "Middleware User", "github-middleware", "127.0.0.1", "UA")
		require.NoError(t, err)

		req := httptest.NewRequest(http.MethodGet, "/admin/protected", nil)
		req.AddCookie(&http.Cookie{
			Name:  auth.AuthCookie,
			Value: user.SessionKey,
		})
		rr := httptest.NewRecorder()

		handler := auth.WithAuthentication(db, dummyHandler)
		handler(rr, req)

		require.Equal(t, http.StatusOK, rr.Code)
		require.Equal(t, "hello Middleware User", rr.Body.String())
	})
}
