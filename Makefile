include test.env
DATABASE_URL := $(shell echo $(DATABASE_URL) | sed 's/"//g')
export DATABASE_URL

build: build-frontend build-backend
	echo "Built"

frontend-deps:
	cd frontend && pnpm i

build-frontend: frontend-deps
	cd frontend && pnpm build

backend-deps:
	go mod download

backend-generate: backend-deps
	cd backend && go generate ./...

frontend-generate: frontend-deps backend-deps
	cd frontend && go generate ./...

generate: frontend-generate backend-generate
	echo "Codegen Done"

build-backend: backend-deps backend-generate
	cd backend && go build 

docker-images:
	docker compose up -d

nuke-db:
	docker compose down database
	docker container rm chessfestreadingknockouttestserver-database-1 || docker compose up database -d

psql:
	docker exec -it -u postgres nagsknightschessleaguetestserver-database-1 bash -c "PG_PASSWORD=bong-cloud psql -U magnus -d knockout-tournament"

frontend-test: frontend-deps generate
	cd frontend && pnpm test

backend-test: backend-deps docker-images generate
	cd backend && go test ./... -timeout=60s

test: frontend-test backend-test
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
