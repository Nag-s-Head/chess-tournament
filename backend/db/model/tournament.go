package model

import (
	"database/sql"
	"errors"
	"time"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TournamentType string

const (
	TournamentType_TwoGroupKnockout TournamentType = "two-group-knockout" // Used for Rhys Fest 2026
)

type Tournament struct {
	Id                  uuid.UUID               `db:"id" json:"id"`
	CreatedBy           uuid.UUID               `db:"created_by" json:"created_by"`
	Created             time.Time               `db:"created" json:"created"`
	Name                string                  `db:"name" json:"name"`
	DescriptionMarkdown string                  `db:"description_markdown" json:"description"`
	StartTime           time.Time               `db:"start_time" json:"start_time"`
	Type                TournamentType          `db:"type" json:"type"`
	PretixUrl           sql.NullString          `db:"pretix_url" json:"pretix_url"`
	PretixApikey        sql.NullString          `db:"pretix_api_key" json:"pretix_api_key"`
	PretixSyncPeriod    sql.Null[time.Duration] `db:"pretix_sync_period" json:"pretix_sync_period"`
	PretixLastSynctime  sql.Null[time.Time]     `db:"pretix_last_sync_time" json:"pretix_last_sync_time"`
}

type CurrentTournament struct {
	TournamentId sql.Null[uuid.UUID] `db:"tournament_id" json:"tournament_id"`
}

func NewTournament(name, descriptionMarkdown string, startTime time.Time, ttype TournamentType, admin uuid.UUID) *Tournament {
	return &Tournament{
		Id:                  uuid.New(),
		CreatedBy:           admin,
		Name:                name,
		DescriptionMarkdown: descriptionMarkdown,
		StartTime:           startTime,
		Created:             time.Now(),
		Type:                ttype,
	}
}

func (t *Tournament) Insert(tx *sqlx.Tx) error {
	_, err := tx.NamedExec(`
		INSERT INTO tournaments (id, created_by, name, description_markdown, start_time, created, type)
		VALUES (:id, :created_by, :name, :description_markdown, :start_time, :created, :type);
		`, t)
	if err != nil {
		return errors.Join(errors.New("Cannot insert tournament"), err)
	}

	return nil
}

func GetTournaments(db db.Db) ([]Tournament, error) {
	tournaments := make([]Tournament, 0)
	err := db.GetSqlxDb().Select(&tournaments, "SELECT * FROM tournaments")
	if err != nil {
		return nil, errors.Join(errors.New("Cannot get tournaments"), err)
	}
	return tournaments, nil
}
