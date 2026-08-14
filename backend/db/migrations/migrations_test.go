package migrations_test

import (
	"testing"

	testutils "github.com/Nag-s-Head/knockout-tournament/backend/db/test_utils"
)

func TestFrom(t *testing.T) {
	d := testutils.GetDb(t)
	d.Close()
}
