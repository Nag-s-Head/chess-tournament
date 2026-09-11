FROM node:26-alpine AS base
RUN npm i -g pnpm@10.28.0

FROM golang:1.27.1-alpine AS golang

FROM base AS with-tools
RUN apk add --no-cache make

# Go is copied from the go alpine container to keep the version pegged
COPY --from=golang /usr/local/go /usr/local/go
ENV GOPATH="/go"
ENV PATH="/usr/local/go/bin:${GOPATH}/bin:${PATH}"
ENV GOCACHE=/root/.cache/go-build

# Install dependencies only when needed
FROM with-tools AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./
COPY ./go.mod ./go.sum ./
RUN --mount=type=cache,target="/go/pkg/mod" \
  --mount=type=cache,target="/app/frontend/node_modules" \
  pnpm --prefix frontend i --frozen-lockfile && \
  go mod download

# Rebuild the source code only when needed
FROM with-tools AS builder
WORKDIR /app
COPY ./ ./
COPY ./Makefile ./test.env ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/app/frontend/.next/cache \
    make frontend-build -j

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV="production"
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT="3000"
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
