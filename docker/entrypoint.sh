#!/bin/sh
set -e

if [ "$1" = "next" ] && [ "$2" = "start" ]; then
  mkdir -p "${MEDIA_DIR:-/data/media}"
  echo "[entrypoint] миграции базы"
  payload migrate
  echo "[entrypoint] начальное наполнение"
  payload run scripts/seed-cms.ts
  echo "[entrypoint] запуск сайта"
fi

exec "$@"
