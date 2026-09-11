package model_test

import (
	"testing"
	"time"

	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/db/test_utils"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/require"
)

func TestNewTournament(t *testing.T) {
	t.Parallel()

	admin := model.NewAdminUser("name", uuid.NewString(), "", "")

	name := uuid.NewString()
	desc := uuid.NewString()
	ttype := model.TournamentType_TwoGroupKnockout
	startTime := time.Now().Add(time.Hour * 24)

	tournament := model.NewTournament(name, desc, startTime, ttype, admin.Id)
	require.NotEmpty(t, tournament)
	require.Equal(t, name, tournament.Name)
	require.Equal(t, desc, tournament.DescriptionMarkdown)
	require.Equal(t, ttype, tournament.Type)
	require.Equal(t, startTime, tournament.StartTime)
	require.Equal(t, admin.Id, tournament.CreatedBy)
	require.NotEmpty(t, tournament.Created)
}

func TestInsertTournament(t *testing.T) {
	t.Parallel()

	db := testutils.GetDb(t)
	defer db.Close()

	admin := model.NewAdminUser(uuid.NewString(), uuid.NewString(), "test", "test")
	tournament := model.NewTournament(uuid.NewString(), uuid.NewString(), time.Now(), model.TournamentType_TwoGroupKnockout, admin.Id)

	require.NoError(t, db.DoTx(func(tx *sqlx.Tx) error {
		require.NoError(t, admin.Insert(tx))
		require.NoError(t, tournament.Insert(tx))
		return nil
	}))
}

func TestGetTournaments(t *testing.T) {
	t.Parallel()

	db := testutils.GetDb(t)
	defer db.Close()

	admin := model.NewAdminUser(uuid.NewString(), uuid.NewString(), "test", "test")
	tournament := model.NewTournament(uuid.NewString(), uuid.NewString(), time.Now(), model.TournamentType_TwoGroupKnockout, admin.Id)

	require.NoError(t, db.DoTx(func(tx *sqlx.Tx) error {
		require.NoError(t, admin.Insert(tx))
		require.NoError(t, tournament.Insert(tx))
		return nil
	}))

	tournaments, err := model.GetTournaments(db)
	require.NoError(t, err)
	require.NotEmpty(t, tournaments)

	found := false
	for _, foundTournament := range tournaments {
		if foundTournament.Id != tournament.Id {
			continue
		}

		found = true
	}

	require.True(t, found)
}
