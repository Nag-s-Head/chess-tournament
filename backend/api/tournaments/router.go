package tournaments

import (
	"net/http"

	"github.com/Nag-s-Head/chess-tournament/backend/db"
	httputils "github.com/Nag-s-Head/chess-tournament/backend/lib/http_utils"
)

func Register(mux *http.ServeMux, database db.Db) {
	mux.HandleFunc("POST /tournaments", httputils.WithAuthentication(database, HandleCreateTournament(database)))
}
