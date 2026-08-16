package api_test

import (
	"testing"

	"github.com/Nag-s-Head/chess-tournament/backend/lib/api_client/client/system"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/lib/test_utils"
	"github.com/stretchr/testify/require"
)

func TestHealthCheck(t *testing.T) {
	client := testutils.GetApiInstance(t)

	resp, err := client.System.GetHealthCheck(system.NewGetHealthCheckParams())
	require.NoError(t, err)
	require.Equal(t, "OK", resp.Payload.Status)
	require.NotEmpty(t, resp.Payload.Time)
}
