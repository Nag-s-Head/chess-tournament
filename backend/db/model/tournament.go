package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type TournamentType string

const (
	TournamentType_TwoGroupKnockout TournamentType = "two-group-knockout" // Used for Rhys Fest 2026
)

type Tournament struct {
	Id               uuid.UUID      `db:"id" json:"id"`
	CreatedBy        uuid.UUID      `db:"created_by" json:"created_by"`
	Name             string         `db:"name" json:"name"`
	Description      string         `db:"description" json:"description"`
	StartTime        time.Time      `db:"start_time" json:"start_time"`
	Created          time.Time      `db:"created" json:"created"`
	Type             TournamentType `db:"type" json:"type"`
	PretixUrl        string         `db:"pretix_url" json:"pretix_url,omitempty"`
	PretixApikey     string         `db:"pretix_api_key" json:"pretix_api_key,omitempty"`
	PretixSyncPeriod time.Duration  `db:"pretix_sync_period" json:"pretix_sync_period"`
}

type CurrentTournament struct {
	TournamentId sql.Null[uuid.UUID] `db:"tournament_id" json:"tournament_id"`
}
