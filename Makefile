build: frontend backend
	echo "Built"

frontend-deps:
	cd frontend && pnpm i

frontend: frontend-deps
	cd frontend && pnpm build

backend-generate:
	cd backend && go generate ./...

frontend-generate: frontend-deps
	cd frontend && go generate ./...

generate: frontend-generate backend-generate
	echo "Codegen Done"

backend: backend-generate
	cd backend && go build 

frontend-test: frontend-deps
	cd frontend && pnpm test

backend-test:
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

backend-lint:
	cd backend && go vet ./...

lint: frontend-lint backend-lint
	echo "Linting Done"

all: build test lint
	echo "All Done"
