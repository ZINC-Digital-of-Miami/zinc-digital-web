#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Keep Linux dependencies separate from the host's development dependencies.
mkdir -p .scratch/docker-node_modules .scratch/docker-npm-cache
# Astro sizes its image queue from CPU affinity. Bound it for the shared local VM.
exec docker run --rm --cpuset-cpus=0,1 \
  -v "$PWD:/app" \
  -v "$PWD/.scratch/docker-node_modules:/app/node_modules" \
  -v "$PWD/.scratch/docker-npm-cache:/root/.npm" \
  -w /app -e ASTRO_TELEMETRY_DISABLED=1 -e CHROMEDRIVER_SKIP_DOWNLOAD=true \
  -e VIPS_CONCURRENCY=1 -e UV_THREADPOOL_SIZE=2 -e MALLOC_ARENA_MAX=2 \
  node:24-trixie sh -eu -c '
    fingerprint=$(sha256sum package-lock.json | cut -d " " -f 1)
    installed=$(cat node_modules/.zinc-lock-sha256 2>/dev/null || true)
    if [ "$fingerprint" != "$installed" ]; then
      npm ci
      printf "%s\n" "$fingerprint" > node_modules/.zinc-lock-sha256
    fi
    npm test
    npm run check
    npm run build
    node scripts/check-site.mjs
  '
