package api

import (
	"net/http"
	"time"

	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
)

// swagger:model
type HealthCheckResp struct {
	Status string    `json:"status"`
	Time   time.Time `json:"time"`
}

// Success response for the health check
// swagger:response healthCheckResponse
type healthCheckResponseWrapper struct {
	// in: body
	Body HealthCheckResp
}

// swagger:route GET /health system getHealthCheck
//
// # Health check for the backend
//
// # Check API health
//
// Produces:
// - application/json
//
// Responses:
//
//	200: healthCheckResponse
func handleHealthCheck() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		httputils.WriteJson(w, HealthCheckResp{
			Status: "OK",
			Time:   time.Now(),
		})
	}
}
