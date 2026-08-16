package main

import (
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
)

//go:generate go run swagger.go

func main() {
	const projectroot = "../../../../"
	const filename = "swagger.gen.json"
	wd, err := os.Getwd()
	if err != nil {
		slog.Error("Cannot get working directory", "err", err)
		os.Exit(1)
	}

	slog.Info("Generating Swagger file from Go code")
	goSwagger := exec.Command(
		"go",
		"run",
		"github.com/go-swagger/go-swagger/cmd/swagger",
		"generate",
		"spec",
		"-o",
		filepath.Join(wd, filename),
	)

	goSwagger.Dir = filepath.Join(projectroot, "backend")
	goSwagger.Stdout = os.Stdout
	goSwagger.Stderr = os.Stderr

	err = goSwagger.Run()
	if err != nil {
		slog.Error("Cannot execute Go Swagger", "err", err)
		os.Exit(1)
	}

	slog.Info("Generating frontend API client...")
	typescriptSwagger := exec.Command("pnpm",
		"exec",
		"swagger-typescript-api",
		"generate",
		"-p",
		filepath.Join(wd, filename),
		"-o",
		wd,
		"-n",
		"api.gen.ts",
	)
	typescriptSwagger.Dir = filepath.Join(projectroot, "frontend")
	typescriptSwagger.Stdout = os.Stdout
	typescriptSwagger.Stderr = os.Stderr

	err = typescriptSwagger.Run()
	if err != nil {
		slog.Error("Cannot execute Typescript Swagger", "err", err)
		os.Exit(1)
	}
}
