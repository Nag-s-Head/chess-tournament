package security_test

import (
	"testing"

	"github.com/Nag-s-Head/chess-tournament/backend/security"
	"github.com/stretchr/testify/require"
)

func TestSessionKey(t *testing.T) {
	for range 1000 {
		key := security.NewSessionkey()
		require.NotEmpty(t, key)
		require.True(t, len(key) > 12)
	}
}
