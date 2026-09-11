package migrations

import (
	"strings"
	"unicode"

	"github.com/djpiper28/rpg-book/common/database/migrations"
)

func Migrations() (*migrations.DbMigrator, int) {
	allMigrations := []migrations.Migration{
		{
			Sql: `
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	oauth_id TEXT NOT NULL UNIQUE,
	created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	session_key TEXT,
	last_login TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_ip TEXT,
	last_user_agent TEXT
);

CREATE INDEX idx_admin_users_session_key ON admin_users(session_key);`,
		},
		{
			Sql: `
CREATE TABLE tournaments (
	id UUID PRIMARY KEY,
	created_by UUID NOT NULL REFERENCES admin_users(id),
	name TEXT NOT NULL,
	description_markdown TEXT NOT NULL,
	start_time TIMESTAMPTZ NOT NULL,
	created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	type TEXT NOT NULL,
	pretix_url TEXT,
	pretix_api_key TEXT,
	pretix_sync_period INTERVAL,
	pretix_last_sync_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE current_tournament (
	one_row BOOL GENERATED ALWAYS AS ( TRUE ) STORED,
	tournament_id UUID REFERENCES tournaments(id)
);

CREATE UNIQUE INDEX idx_current_tournament_one_row ON current_tournament ( ( one_row ) );

INSERT INTO current_tournament (tournament_id) VALUES (NULL);
			`,
		},
	}
	return migrations.New(allMigrations), len(allMigrations)
}

func InternalFixPlayerNameCapitals(name string) string {
	parts := strings.Split(name, " ")
	for i, str := range parts {
		strBytes := []byte(str)
		if len(str) > 0 {
			strBytes[0] = byte(unicode.ToUpper(rune(str[0])))
		}
		parts[i] = string(strBytes)
	}

	return strings.Join(parts, " ")
}
