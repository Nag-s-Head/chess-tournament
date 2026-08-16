// Package classification API.
//
// Chess Tournament API.
//
//	Schemes: http, https
//	Version: 1.0.0
//
//	Consumes:
//	- application/json
//
//	Produces:
//	- application/json
//
// swagger:meta
package main

import (
	"log/slog"
	"os"

	"github.com/Nag-s-Head/chess-tournament/backend/api"
	psqldb "github.com/Nag-s-Head/chess-tournament/backend/db/psql_db"
)

const DefaultAddr = "0.0.0.0:8080"

func main() {
	slog.Info("Starting...")

	defer os.Exit(1)

	slog.Info("Connecting to the database...")
	database, err := psqldb.New()
	if err != nil {
		slog.Error("Could not connect to database - aborting", "err", err)
		return
	}

	defer database.Close()

	err = database.GetSqlxDb().Ping()
	if err != nil {
		slog.Error("Could not ping database", "err", err)
		return
	}

	slog.Info("Database connected successfully")

	addr := os.Getenv("ADDR")
	if addr == "" {
		slog.Info("Using default ADDR")
		addr = DefaultAddr
	}

	slog.Info("Starting Chess Fest Reading server", "addr", addr)
	err = api.Start(addr, database)
	if err != nil {
		slog.Error("Server could not start", "err", err)
	}

	slog.Warn("Server has died (very sad)")
}
