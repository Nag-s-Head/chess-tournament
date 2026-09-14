package tournaments

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	"github.com/Nag-s-Head/chess-tournament/backend/db/model"
	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
	"github.com/jmoiron/sqlx"
)

// Success response for the create tournament endpoint
// swagger:response createTournamentResponse
type createTournamentWrapper struct {
	// in:body
	Body CreateTournamenResponse
}

// swagger:parameters postTournaments
type createTournamentParamsWrapper struct {
	// in:body
	Body CreateTournamentRequest
}

// swagger:model
type CreateTournamenResponse struct {
}

// swagger:model
type CreateTournamentRequest struct {
	Name                string               `json:"name"`
	DescriptionMarkdown string               `json:"description_markdown"`
	StartTime           time.Time            `json:"start_time"`
	Ttype               model.TournamentType `json:"tournament_type"`
}

// swagger:route POST /tournaments tournaments postTournaments
//
// Summary: Creates a tournament
//
// Description: Creates a tournament with the most basic information.
//
// Parameters:
//   - name: body
//     in: body
//     required: true
//     type: CreateTournamentRequest
//
// Responses:
//
//	200: createTournamentResponse
func HandleCreateTournament(database db.Db) func(au *model.AdminUser, logger slog.Logger) func(http.ResponseWriter, *http.Request) {
	return func(au *model.AdminUser, logger slog.Logger) func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			httputils.ReadJson(w, r, func(data CreateTournamentRequest) {
				tournament := model.NewTournament(data.Name, data.DescriptionMarkdown, data.StartTime, data.Ttype, au.Id)

				err := database.DoTx(func(tx *sqlx.Tx) error {
					return tournament.Insert(tx)
				})

				if err != nil {
					logger.Error("Cannot create torunament", "err", err)
					http.Error(w, "Cannot create tournament", http.StatusInternalServerError)
					return
				}
			})
		}
	}
}
