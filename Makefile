build: frontend backend
	echo "Built"

frontend-deps:
	cd frontend && pnpm i

frontend: frontend-deps
	cd frontend && pnpm build

backend-deps:
	go mod download

backend-generate: backend-deps
	cd backend && go generate ./...

frontend-generate: frontend-deps backend-deps
	cd frontend && go generate ./...

generate: frontend-generate backend-generate
	echo "Codegen Done"

backend: backend-deps backend-generate
	cd backend && go build 

frontend-test: frontend-deps
	cd frontend && pnpm test

backend-test: backend-deps
	cd backend && go test ./... -timeout=60s

test: frontend-test backend-test generate
	$(MAKE) lint

backend-format:
	gofmt -l -w .

frontend-format: frontend-deps
	cd frontend && pnpm format

format: backend-format frontend-format
	echo "Format Done"

frontend-lint: frontend-deps
	cd frontend && pnpm lint

backend-lint: backend-deps
	cd backend && go vet ./...

lint: frontend-lint backend-lint
	echo "Linting Done"

all: build test lint
	echo "All Done"
