package auth_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Nag-s-Head/chess-tournament/backend/api/auth"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/db/test_utils"
	"github.com/stretchr/testify/require"
)

func TestHandleValidate(t *testing.T) {
	db := testutils.GetDb(t)
	defer db.Close()

	t.Run("No cookie or header", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/validate", nil)
		rr := httptest.NewRecorder()

		handler := auth.HandleValidate(db)
		handler(rr, req)

		require.Equal(t, http.StatusOK, rr.Code)

		var resp auth.ValidateResponse
		err := json.Unmarshal(rr.Body.Bytes(), &resp)
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "Login", resp.Status)
		require.NotEmpty(t, resp.Url)
	})

	t.Run("Valid session cookie", func(t *testing.T) {
		user, err := model.AdminLogin(db, "Validate Tester Cookie", "github-validate-cookie", "127.0.0.1", "UA")
		require.NoError(t, err)

		req := httptest.NewRequest(http.MethodGet, "/auth/validate", nil)
		req.AddCookie(&http.Cookie{
			Name:  auth.AuthCookie,
			Value: user.SessionKey,
		})
		rr := httptest.NewRecorder()

		handler := auth.HandleValidate(db)
		handler(rr, req)

		require.Equal(t, http.StatusOK, rr.Code)

		var resp auth.ValidateResponse
		err = json.Unmarshal(rr.Body.Bytes(), &resp)
		require.NoError(t, err)
		require.True(t, resp.Valid)
		require.Equal(t, "Valid", resp.Status)
	})

	t.Run("Valid bearer header", func(t *testing.T) {
		user, err := model.AdminLogin(db, "Validate Tester Header", "github-validate-header", "127.0.0.1", "UA")
		require.NoError(t, err)

		req := httptest.NewRequest(http.MethodGet, "/auth/validate", nil)
		req.Header.Set("Authorization", "Bearer "+user.SessionKey)
		rr := httptest.NewRecorder()

		handler := auth.HandleValidate(db)
		handler(rr, req)

		require.Equal(t, http.StatusOK, rr.Code)

		var resp auth.ValidateResponse
		err = json.Unmarshal(rr.Body.Bytes(), &resp)
		require.NoError(t, err)
		require.True(t, resp.Valid)
		require.Equal(t, "Valid", resp.Status)
	})

	t.Run("Invalid session cookie", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/validate", nil)
		req.AddCookie(&http.Cookie{
			Name:  auth.AuthCookie,
			Value: "non-existent-session-key",
		})
		rr := httptest.NewRecorder()

		handler := auth.HandleValidate(db)
		handler(rr, req)

		require.Equal(t, http.StatusOK, rr.Code)

		var resp auth.ValidateResponse
		err := json.Unmarshal(rr.Body.Bytes(), &resp)
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "Login", resp.Status)
		require.NotEmpty(t, resp.Url)
	})
}
