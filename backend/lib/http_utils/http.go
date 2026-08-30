package httputils

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"runtime"
)

func WriteJson(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")

	_, file, line, _ := runtime.Caller(1)

	bytes, err := json.Marshal(data)
	if err != nil {
		slog.Error("Cannot marshal JSON", "err", err, "file", file, "line", line)
		panic(errors.Join(errors.New("cannot marshal JSON"), err))
	}

	_, err = w.Write(bytes)
	if err != nil {
		panic(errors.Join(errors.New("cannot write data"), err))
	}
}
