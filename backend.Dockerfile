FROM golang:1.27.1-trixie AS initial

FROM initial AS with_go_mod
COPY ./go.mod ./go.sum ./
RUN go mod download

FROM with_go_mod AS build
WORKDIR /build
COPY ./go.mod ./go.sum ./Makefile ./test.env ./
COPY ./backend ./backend
ENV GOCACHE=/root/.cache/go-build
RUN --mount=type=cache,target="/root/.cache/go-build" make backend-build -j

FROM initial AS release
RUN useradd -m app
WORKDIR /home/app
USER app

ENV ADDR="0.0.0.0:8080"
EXPOSE 8080
COPY --from=build /build/backend/backend .
CMD ["./backend"]
