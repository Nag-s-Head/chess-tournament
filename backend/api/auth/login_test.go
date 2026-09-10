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
	t.Parallel()
	t.Setenv("TEST_MODE", "false")

	db := testutils.GetDb(t)
	defer db.Close()

	req := httptest.NewRequest(http.MethodGet, "/auth/login", nil)
	rr := httptest.NewRecorder()

	auth.HandleLogin(rr, req)

	require.Equal(t, http.StatusTemporaryRedirect, rr.Code)
	require.NotEmpty(t, rr.Header().Get("Location"))
}
