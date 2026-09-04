package auth_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Nag-s-Head/chess-tournament/backend/api/auth"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/db/test_utils"
	"github.com/stretchr/testify/require"
)

func TestHandleLogin(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/auth/login", nil)
	rr := httptest.NewRecorder()

	auth.HandleLogin(rr, req)

	require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
	require.NotEmpty(t, rr.Header().Get("Location"))
}

func TestHandleTestLogin(t *testing.T) {
	t.Setenv("TEST_MODE", "true")
	db := testutils.GetDb(t)
	defer db.Close()

	t.Run("Valid test session", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/test-login?session=valid", nil)
		rr := httptest.NewRecorder()

		handler := auth.HandleTestLogin(db)
		handler(rr, req)

		require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
		require.Equal(t, "/admin", rr.Header().Get("Location"))
		cookies := rr.Result().Cookies()
		require.Len(t, cookies, 1)
		require.Equal(t, auth.AuthCookie, cookies[0].Name)
		require.NotEmpty(t, cookies[0].Value)
	})

	t.Run("Invalid test session", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/test-login?session=invalid", nil)
		rr := httptest.NewRecorder()

		handler := auth.HandleTestLogin(db)
		handler(rr, req)

		require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
		require.Equal(t, "/auth-error?reason=invalid_session", rr.Header().Get("Location"))
		require.Empty(t, rr.Result().Cookies())
	})

	t.Run("Clear session", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/test-login?session=clear", nil)
		rr := httptest.NewRecorder()

		handler := auth.HandleTestLogin(db)
		handler(rr, req)

		require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
		require.Equal(t, "/login", rr.Header().Get("Location"))
	})
}

func TestHandleCallbackMissingCode(t *testing.T) {
	db := testutils.GetDb(t)
	defer db.Close()

	req := httptest.NewRequest(http.MethodGet, "/auth/callback", nil)
	rr := httptest.NewRecorder()

	handler := auth.HandleCallback(db)
	handler(rr, req)

	require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
	require.Equal(t, "/auth-error?reason=no_code", rr.Header().Get("Location"))
}
