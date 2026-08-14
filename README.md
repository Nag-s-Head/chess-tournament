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
make backend-build -j
make build-frontned -j

make test -j # Runs the tests and linters on the code

# Or if you want to test just the backend or frontend
make test-backend -j
make test-frontned -j

make all -j # Runs the builds and tests

make nuke-db # Deletes the test database
make psql # Enters a shell with psql on the test database
```

### Environment Variables

#### Backend

| Variable            | Usage                                                                         | Example                                                                                              |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| DATABASE_URL        | The full URL of the Postgres database                                         | `user=magnus password=bong-cloud dbname=knockout-tournament host=database port=5432 sslmode=disable` |
| GITHUB_ORGANISATION | The full name of the organisation                                             | `Nag-s-Head`, as seen in our repo's URL `https://github.com/Nag-s-Head/knockout-tournament`          |
| OAUTH_CLIENT_ID     | Used for admin portal authentication, created under Github developer settings | `1234...`                                                                                            |
| OAUTH_CLIENT_SECRET | Used for admin portal authentication, created under Github developer settings | `1234...`                                                                                            |
| TEST_MODE           | When enabled this uses a mocked Oauth implementation                          | `true` or omit to disable                                                                            |
| ADDR                | Bind address of the application                                               | `0.0.0.0:8080` (the default value)                                                                   |
