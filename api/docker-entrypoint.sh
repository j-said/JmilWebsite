#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "entrypoint: alembic upgrade head"
    alembic upgrade head
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
    echo "entrypoint: seeding demo data"
    python -m app.seed
fi

exec "$@"
