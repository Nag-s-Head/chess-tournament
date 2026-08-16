package testutils

import (
	"fmt"
	"log/slog"
	"sync"
	"testing"
	"time"

	"github.com/Nag-s-Head/chess-tournament/backend/api"
	testutils "github.com/Nag-s-Head/chess-tournament/backend/db/test_utils"
	"github.com/Nag-s-Head/chess-tournament/backend/lib/api_client/client"
	"github.com/Nag-s-Head/chess-tournament/backend/lib/api_client/client/system"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"
	"github.com/stretchr/testify/require"
)

const ApiAddress = "0.0.0.0:8082"
const maxTries = 10

var isStarted bool
var apiStart sync.Mutex

func startApiServer(t *testing.T) {
	t.Helper()

	apiStart.Lock()
	defer apiStart.Unlock()

	if !isStarted {
		isStarted = true
		go func() {
			db := testutils.GetDb(t)
			defer db.Close()

			slog.Info("Starting test server")
			err := api.Start(ApiAddress, db)
			if err != nil {
				slog.Error("Cannot start API server", "err", err)
				panic(fmt.Sprintf("Cannot start API server: %s", err))
			}
		}()
	}

	for i := range maxTries {
		_, err := getClient().System.GetHealthCheck(system.NewGetHealthCheckParams())
		if err == nil {
			return
		}

		t.Logf("Could not communicate with server: %s, waiting... try %d/%d", err, i+1, maxTries)
		time.Sleep(time.Second / 5)
	}

	require.Fail(t, "Unable to connect to the server")
}

func getClient() *client.APIGen {
	transport := httptransport.New(ApiAddress, "", []string{"http"})
	return client.New(transport, strfmt.Default)
}

func GetApiInstance(t *testing.T) *client.APIGen {
	startApiServer(t)
	return getClient()
}
