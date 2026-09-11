package auth_test

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Nag-s-Head/chess-tournament/backend/api/auth"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/db/test_utils"
	"github.com/stretchr/testify/require"
)

func TestHandleCallbackTestMode(t *testing.T) {
	t.Parallel()
	t.Setenv("TEST_MODE", "true")

	db := testutils.GetDb(t)
	defer db.Close()

	t.Run("Valid test session", func(t *testing.T) {
		t.Parallel()

		req := httptest.NewRequest(http.MethodGet, "/auth/callback?code=valid", nil)
		rr := httptest.NewRecorder()

		handler := auth.HandleCallback(db)
		handler(rr, req)

		bodyBytes, err := io.ReadAll(rr.Body)
		require.NoError(t, err)

		var body auth.CallbackResponse
		err = json.Unmarshal(bodyBytes, &body)
		require.NoError(t, err)

		require.Equal(t, "/admin", rr.Header().Get("Location"))
		require.NotEmpty(t, body.Token)
	})
}

func TestHandleCallbackMissingCode(t *testing.T) {
	t.Parallel()
	t.Setenv("TEST_MODE", "false")

	db := testutils.GetDb(t)
	defer db.Close()

	req := httptest.NewRequest(http.MethodGet, "/auth/callback", nil)
	rr := httptest.NewRecorder()

	handler := auth.HandleCallback(db)
	handler(rr, req)

	require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
	require.Equal(t, "/auth/error?reason=no_code", rr.Header().Get("Location"))
}
