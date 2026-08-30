package api

import (
	"log/slog"
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/api/auth"
	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func Start(addr string, database db.Db) error {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handleHealthCheck())
	mux.Handle("GET /metrics", promhttp.Handler())
	auth.Register(mux, database)

	handler := prometheusMiddleware(mux)
	err := http.ListenAndServe(addr, handler)
	if err != nil {
		slog.Error("Could not start", "err", err, "addr", addr)
		return err
	}
	return nil
}
