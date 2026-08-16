package main

import (
	"os"
	"os/exec"
	"path/filepath"

	"github.com/charmbracelet/log"
)

//go:generate go run swagger.go

func main() {
	const backendRoot = "../../"
	wd, err := os.Getwd()
	if err != nil {
		log.Error("Cannot get working directory", "err", err)
		os.Exit(1)
	}

	filename := filepath.Join(wd, "swagger.gen.json")

	log.Info("Generating Swagger file from Go code")
	goSwagger := exec.Command(
		"go",
		"run",
		"github.com/go-swagger/go-swagger/cmd/swagger",
		"generate",
		"spec",
		"-o",
		filename,
	)

	goSwagger.Dir = filepath.Join(backendRoot)
	goSwagger.Stdout = os.Stdout
	goSwagger.Stderr = os.Stderr

	err = goSwagger.Run()
	if err != nil {
		log.Error("Cannot execute Go Swagger", "err", err)
		os.Exit(1)
	}

	clientSwagger := exec.Command(
		"go",
		"run",
		"github.com/go-swagger/go-swagger/cmd/swagger",
		"generate",
		"client",
		"-f",
		filename,
		"-A",
		"api.gen",
	)

	clientSwagger.Dir = wd
	clientSwagger.Stdout = os.Stdout
	clientSwagger.Stderr = os.Stderr

	err = clientSwagger.Run()
	if err != nil {
		log.Error("Cannot execute Swagger Client", "err", err)
		os.Exit(1)
	}
}
