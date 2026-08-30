package testmode_test

import (
	"os"
	"testing"

	testmode "github.com/Nag-s-Head/chess-tournament/backend/test_mode"
	"github.com/stretchr/testify/require"
)

func TestIsTestModeFalse(t *testing.T) {
	require.NoError(t, os.Setenv(testmode.ENV_VAR, "false"))
	require.False(t, testmode.IsTestMode())
}

func TestIsTestModeTrue(t *testing.T) {
	require.NoError(t, os.Setenv(testmode.ENV_VAR, "true"))
	require.True(t, testmode.IsTestMode())
}
