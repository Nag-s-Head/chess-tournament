FROM node:25-alpine AS base
RUN npm i -g pnpm@10.28.0

FROM base AS with-tools
RUN apk add --no-cache go make

# Install dependencies only when needed
FROM with-tools AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM with-tools AS builder
WORKDIR /app
COPY ./frontend/ ./frontend/
COPY --from=deps /app/node_modules ./frontend/node_modules
COPY ./go.mod ./go.sum ./Makefile ./test.env ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ENV GOCACHE=/root/.cache/go-build
RUN --mount=type=cache,target="/root/.cache/go-build" make frontend-build -j 

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
