#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .deploy.env ]; then
  cat <<'EOF'
Нет файла .deploy.env. Создайте его рядом с package.json:

  DEPLOY_HOST=root@1.2.3.4
  DEPLOY_DIR=/srv/fitsweet

EOF
  exit 1
fi
set -a
. ./.deploy.env
set +a

HOST="${DEPLOY_HOST:?DEPLOY_HOST не задан в .deploy.env}"
DIR="${DEPLOY_DIR:-/srv/fitsweet}"
APP="$DIR/app"
DATA="$DIR/data"
SSH=(ssh -o ServerAliveInterval=30 "$HOST")

say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
remote() { "${SSH[@]}" "cd '$APP' && $*"; }
notify() { remote "docker compose exec -T watchdog node docker/watchdog.mjs notify $(printf '%q' "$1")" >/dev/null 2>&1 || true; }

cmd_setup() {
  say "Настройка сервера $HOST"
  "${SSH[@]}" "DIR='$DIR' bash -s" <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq ca-certificates curl ufw fail2ban unattended-upgrades rsync sqlite3 >/dev/null
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh >/dev/null
fi
systemctl enable --now docker >/dev/null
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw allow 443/udp >/dev/null
ufw --force enable >/dev/null
mem_mb=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
if [ "$mem_mb" -lt 3500 ] && ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "Добавлен swap 2 ГБ (памяти ${mem_mb} МБ)"
fi
mkdir -p "$DIR/app" "$DIR/data/media" "$DIR/data/backups"
chown -R 1000:1000 "$DIR/data"
dpkg-reconfigure -f noninteractive unattended-upgrades >/dev/null 2>&1 || true
echo "Готово: Docker $(docker --version | cut -d' ' -f3 | tr -d ,), файрвол (22, 80, 443), папки в $DIR"
REMOTE
  if ! "${SSH[@]}" "test -f '$APP/.env'"; then
    cat <<EOF

Осталось один раз создать файл настроек на сервере: $APP/.env
Возьмите за основу .env.example и обязательно задайте:
  PAYLOAD_SECRET=…            (openssl rand -hex 32)
  NEXT_PUBLIC_SITE_URL=https://fitsweet.md
  SITE_URL=https://fitsweet.md
  SITE_DOMAIN=fitsweet.md
  ADMIN_DOMAIN=admin.fitsweet.md
  ADMIN_URL=https://admin.fitsweet.md
  ACME_EMAIL=ваша почта (для сертификатов HTTPS)
  DATA_DIR=$DATA
  TELEGRAM_BOT_TOKEN=…   TELEGRAM_BOT_USERNAME=…
  HEALTHCHECKS_URL=…     (по желанию)
Команда: ssh $HOST "nano $APP/.env"
EOF
  fi
}

cmd_ship() {
  local rev msg
  rev="$(git rev-parse --short HEAD 2>/dev/null || echo local)"
  msg="$(git log -1 --pretty=%s 2>/dev/null || echo '')"
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    echo "⚠️  Есть незакоммиченные изменения — они тоже уедут на сервер."
  fi
  "${SSH[@]}" "test -f '$APP/.env'" || { echo "На сервере нет $APP/.env — сначала pnpm server:setup и создайте .env"; exit 1; }

  say "Отправляю код ($rev)"
  rsync -az --delete \
    --exclude .git --exclude node_modules --exclude .next --exclude data --exclude media \
    --exclude backups --exclude .docker-data --exclude '.env' --exclude '.env.*' --exclude .deploy.env \
    --include .env.example \
    ./ "$HOST:$APP/"

  say "Собираю новую версию (старая продолжает работать)"
  if ! remote "docker compose build app"; then
    notify "✖️ <b>Сборка не удалась</b> · $rev — на сайте осталась прежняя версия"
    echo "Сборка упала — сайт работает на прежней версии."
    exit 1
  fi

  say "Переключаю на новую версию"
  remote "docker compose up -d --remove-orphans"

  say "Жду, пока сайт ответит"
  local status=""
  for _ in $(seq 1 40); do
    status="$("${SSH[@]}" "docker inspect -f '{{.State.Health.Status}}' fitsweet-app 2>/dev/null" || true)"
    [ "$status" = "healthy" ] && break
    sleep 5
  done
  if [ "$status" = "healthy" ]; then
    notify "🚀 <b>Выложена новая версия</b> · $rev · $msg"
    echo "Готово: сайт работает на версии $rev"
  else
    notify "🔴 <b>Новая версия не поднялась</b> · $rev — смотрите pnpm server:logs"
    echo "Сайт не поднялся (статус: ${status:-нет}). Последние строки лога:"
    remote "docker compose logs --tail=60 app"
    exit 1
  fi
}

cmd_data() {
  echo "Это ЗАМЕНИТ базу и картинки на сервере вашими локальными (data/fitsweet.db и media/)."
  read -r -p "Продолжить? Напишите yes: " answer
  [ "$answer" = "yes" ] || { echo "Отменено"; exit 1; }
  local snapshot
  snapshot="$(mktemp -t fitsweet-db).db"
  sqlite3 -readonly data/fitsweet.db ".backup '$snapshot'"
  say "Останавливаю сайт и делаю копию серверной базы"
  remote "docker compose stop app watchdog || true"
  "${SSH[@]}" "test -f '$DATA/fitsweet.db' && cp '$DATA/fitsweet.db' '$DATA/backups/before-upload-$(date +%Y%m%d-%H%M%S).db' || true"
  say "Отправляю базу и картинки"
  rsync -az "$snapshot" "$HOST:$DATA/fitsweet.db"
  rsync -az --delete media/ "$HOST:$DATA/media/"
  rm -f "$snapshot"
  "${SSH[@]}" "chown -R 1000:1000 '$DATA'"
  say "Запускаю сайт"
  remote "docker compose up -d"
  echo "Готово."
}

cmd_logs() { remote "docker compose logs -f --tail=100 ${1:-app}"; }

cmd_status() {
  remote "docker compose ps"
  echo
  remote "docker compose exec -T app node -e \"fetch('http://127.0.0.1:3000/api/health').then(r=>r.json()).then(j=>console.log(JSON.stringify(j,null,2)))\""
}

cmd_backup() { remote "docker compose exec -T watchdog node docker/watchdog.mjs backup"; }

case "${1:-}" in
  setup) cmd_setup ;;
  ship) cmd_ship ;;
  data) cmd_data ;;
  logs) shift; cmd_logs "${1:-}" ;;
  status) cmd_status ;;
  backup) cmd_backup ;;
  *) echo "Использование: scripts/server.sh setup|ship|data|logs [app|caddy|watchdog]|status|backup"; exit 1 ;;
esac
