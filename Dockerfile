# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────
# Stage 1 – deps: install all dependencies (dev + prod)
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────────────────────
# Stage 2 – builder: compile app and compile migration script
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Compile migrate.ts to CommonJS using tsc (typescript is a direct devDependency).
# --rootDir lib/db + --outDir . places migrate.js at the project root.
RUN node_modules/.bin/tsc lib/db/migrate.ts \
    --target ES2022 \
    --module commonjs \
    --moduleResolution node \
    --esModuleInterop \
    --skipLibCheck \
    --rootDir lib/db \
    --outDir .

# Build Next.js standalone output.
# Migrations are intentionally excluded — they run at container startup.
RUN pnpm next build

# ─────────────────────────────────────────────────────────────
# Stage 3 – runner: minimal production image
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets (not included in standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
# Public directory
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

# Compiled migration script (CJS, no tsx needed at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/migrate.js       ./migrate.js
# Migration SQL files read by drizzle migrator at runtime
COPY --from=builder --chown=nextjs:nodejs /app/lib/db/migrations ./lib/db/migrations

# The standalone output only traces what Next.js itself imports.
# migrate.js also needs drizzle-orm, postgres, and dotenv — copy them explicitly.
# Docker COPY follows pnpm symlinks, so the actual package files are copied.
# All three are zero-dependency packages so no transitive deps need to follow.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/postgres    ./node_modules/postgres
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv      ./node_modules/dotenv

# Startup entrypoint
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
