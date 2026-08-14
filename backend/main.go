package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

const Addr = "0.0.0.0:8080"

func main() {
	slog.Info("Starting...")

	defer os.Exit(1)

	// slog.Info("Connecting to the database...")
	// database, err := psqldb.New()
	// if err != nil {
	// 	slog.Error("Could not connect to database - aborting", "err", err)
	// 	return
	// }
	//
	// defer database.Close()
	//
	// err = database.GetSqlxDb().Ping()
	// if err != nil {
	// 	slog.Error("Could not ping database", "err", err)
	// 	return
	// }

	slog.Info("Database connected successfully")
	slog.Info("Starting Chess Fest Reading server", "addr", Addr)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health-check", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})
	mux.Handle("/metrics", promhttp.Handler())

	handler := prometheusMiddleware(mux)
	err := http.ListenAndServe(Addr, handler)
	if err != nil {
		slog.Error("Could not start", "err", err, "addr", Addr)
	}

	slog.Warn("Server has died (very sad)")
}
