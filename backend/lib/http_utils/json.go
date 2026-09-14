package httputils

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"runtime"
)

func WriteJson(w http.ResponseWriter, data any) {
	_, file, line, _ := runtime.Caller(1)

	bytes, err := json.Marshal(data)
	if err != nil {
		slog.Error("Cannot marshal JSON", "err", err, "file", file, "line", line)
		http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	_, err = w.Write(bytes)
	if err != nil {
		panic(errors.Join(errors.New("cannot write data"), err))
	}
}

func ReadJson[T any](w http.ResponseWriter, r *http.Request, next func(data T)) {
	_, file, line, _ := runtime.Caller(1)
	var output T
	data, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error("Cannot read body", "err", err, "file", file, "line", line)
		http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(data, &output)
	if err != nil {
		slog.Error("Cannot unmarshal JSON", "err", err, "file", file, "line", line)
		http.Error(w, `{"error":"internal server error"}`, http.StatusBadRequest)
		return
	}

	next(output)
}
