# knockout-tournament

The website for promoting and running a knockout-style chess tournament.

## Developer Guide

This web app has two parts: a Go backend, and a NextJS frontend.

### Local Setup

```sh
docker compose up --watch --build
```

### Scripts

```sh
make build -j # Builds all parts of the app

# Or if you want to build just the backend or frontend
make build-backend -j
make build-frontned -j

make test -j # Runs the tests and linters on the code

# Or if you want to test just the backend or frontend
make test-backend -j
make test-frontned -j

make all -j # Runs the builds and tests
```
