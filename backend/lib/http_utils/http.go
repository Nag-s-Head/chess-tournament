package httputils

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"runtime"
)

func WriteJson(w http.ResponseWriter, data any) error {
	w.Header().Set("Content-Type", "application/json")

	_, file, line, _ := runtime.Caller(1)

	bytes, err := json.Marshal(data)
	if err != nil {
		slog.Error("Cannot marshal JSON", "err", err, "file", file, "line", line)
		return errors.Join(errors.New("Cannot marshal JSON"), err)
	}

	_, err = w.Write(bytes)
	if err != nil {
		return errors.Join(errors.New("Cannot write data"), err)
	}
	return nil
}
