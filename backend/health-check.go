package main

import (
	"net/http"
	"time"

	"github.com/Nag-s-Head/chess-tournament/backend/utils"
)

// swagger:model
type HealthCheckResp struct {
	Status string    `json:"status"`
	Time   time.Time `json:"time"`
}

// swagger:route GET /health system getHealthCheck
//
// # Check API health
//
// Produces:
// - application/json
//
// Responses:
//	200:
//	  healthCheckResponse
func handleHealthCheck() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		utils.WriteJson(w, HealthCheckResp{
			Status: "OK",
			Time:   time.Now(),
		})
	}
}
