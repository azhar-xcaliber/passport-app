#!/bin/sh
set -e

echo "==> Running database migrations..."
node migrate.js

echo "==> Starting Next.js..."
exec node server.js
