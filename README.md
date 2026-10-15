# FitSweet

Лендинг ПП-десертов FitSweet — Next.js 16 (App Router) + Payload CMS 3 + TypeScript + Tailwind CSS v4.
Двуязычный: русский (`/ru`) и румынский (`/ro`).

## Требования

- **Node.js ≥ 22.13** (в репозитории есть `.nvmrc`)
- **pnpm 11** (зафиксирован в `packageManager`, подтягивается через corepack)

```bash
nvm use          # переключит на Node 22 по .nvmrc
corepack enable  # если pnpm ещё не активирован
```

## Команды

```bash
pnpm install   # установка зависимостей
pnpm dev       # дев-сервер (http://localhost:3000)
pnpm build     # production-сборка
pnpm start     # запуск собранного приложения
pnpm lint      # ESLint
pnpm exec tsc --noEmit   # проверка типов
pnpm local     # всё сразу, как на сервере: миграции → наполнение → сборка → запуск (http://localhost:3000)
pnpm dev:full  # то же для разработки: миграции → наполнение → дев-сервер
```

Сайт, админка (`/admin`) и API — одно приложение: одна команда запускает всё сразу.

## Docker на Mac (Colima)

Docker работает только на Linux, поэтому на Mac он запускается внутри маленькой виртуальной машины.
Её создаёт и запускает **Colima** — бесплатная консольная замена Docker Desktop (без окна, всё из терминала).
На сервере с Ubuntu Colima не нужна — там Docker работает напрямую.

### Установка с нуля

```bash
# 1. Homebrew (если ещё нет)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Colima и консольный Docker
brew install colima docker docker-compose docker-buildx

# 3. Научить docker находить плагины compose и buildx
#    (если ~/.docker/config.json уже есть — не затирайте, а добавьте строку cliPluginsExtraDirs)
mkdir -p ~/.docker
cat > ~/.docker/config.json <<'JSON'
{
  "cliPluginsExtraDirs": ["/opt/homebrew/lib/docker/cli-plugins"]
}
JSON

# 4. Первый запуск машины: 4 ядра, 6 ГБ памяти, 40 ГБ диска, встроенная виртуализация macOS
colima start --cpu 4 --memory 6 --disk 40 --vm-type vz

# 5. Проверка
docker version                 # должны быть Client и Server
docker compose version
docker run --rm hello-world    # «Hello from Docker!» — всё работает
```

### Каждый день

```bash
colima start     # запустить Docker (после перезагрузки Mac сам не стартует; параметры запомнены)
colima stop      # остановить и освободить память
colima status    # работает ли сейчас
```

Автозапуск вместе с Mac: `brew services start colima` (выключить: `brew services stop colima`).
Если `docker` пишет «Cannot connect to the Docker daemon» — Colima не запущена, выполните `colima start`.

Поменять память или ядра: `colima stop`, затем `colima start --cpu 4 --memory 8`.

Удалить всё начисто (вместе со всеми образами и контейнерами):

```bash
colima delete
brew uninstall colima docker docker-compose docker-buildx
```

## Выкладка на сервер

Сервер описан в `.deploy.env` (не попадает в git):

```bash
DEPLOY_HOST=root@1.2.3.4
DEPLOY_DIR=/srv/fitsweet
```

```bash
pnpm server:setup   # один раз: Docker, файрвол, swap, папки на сервере
pnpm ship:data      # один раз: перенести локальную базу и картинки на сервер
pnpm ship           # выложить текущий код (сборка → переключение → проверка → 🚀 в Telegram)
pnpm server:status  # контейнеры и /api/health
pnpm server:logs    # живые логи сайта (или: pnpm server:logs watchdog / caddy)
pnpm server:backup  # бэкап базы прямо сейчас
```

На сервере работают три контейнера (`docker-compose.yml`): сайт, Caddy (HTTPS, домены `SITE_DOMAIN` и `ADMIN_DOMAIN`)
и сторож (`docker/watchdog.mjs`): тревоги в Telegram администраторам, ночной бэкап базы с хранением 14 дней,
утренняя сводка, пинг Healthchecks. Настройки — в `.env` на сервере, образец — `.env.example`.

Проверить связку локально (копия базы в `.docker-data/`, домены `fitsweet.localhost` и `admin.fitsweet.localhost`):

```bash
docker compose --env-file .docker-data/compose.env up -d --build
open https://fitsweet.localhost:8443/ru
docker compose --env-file .docker-data/compose.env down
```

## Структура

```
app/
  layout.tsx            # корневой каркас (разметку задаёт [locale])
  page.tsx              # / → редирект на /ru
  globals.css           # дизайн-токены (@theme), утилиты, стили карты
  [locale]/
    layout.tsx          # <html lang>, шрифты, метаданные, hreflang, I18nProvider
    page.tsx            # сборка секций + JSON-LD на нужном языке
  api/order/route.ts    # приём заказа (пока пишет в консоль)
components/
  layout/               # Header, Footer, CartDrawer, Logo, LocaleSwitch
  sections/             # Hero, Catalog, Moods, WhereToBuy, Delivery,
                        # BoxBuilder, Reviews, InstagramFeed, OrderForm, FinalCta
  ui/                   # Button, Chip, SectionTitle, ProductCard, Icons,
                        # Stamp, LeafletMap
lib/
  i18n/
    config.ts           # список локалей, коды hreflang
    ru.ts               # русский словарь + тип Dictionary
    ro.ts               # румынский словарь (типизирован по Dictionary)
    context.tsx         # I18nProvider / useI18n для клиентских компонентов
    index.ts            # getDictionary
  products.ts           # каталог (цены и составы — реальные, RU + RO)
  moods.ts              # группировка по настроениям
  locations.ts          # точки продаж + координаты (заглушка)
  delivery.ts           # константы доставки; тексты — в словарях
  reviews.ts            # отзывы (заглушка)
  cart.ts               # корзина: zustand + persist(localStorage)
  filter.ts             # связь «настроение → каталог»
scripts/
  gen-placeholders.mjs  # генератор SVG-заглушек под фото
```

## Языки

Локали заданы в `lib/i18n/config.ts`. Каждая получает свой URL (`/ru`, `/ro`),
свой `<html lang>`, canonical и `hreflang` — обе страницы пререндерятся статически.

**Как добавить язык:**

1. Добавить код в `locales` и `localeTags` (`lib/i18n/config.ts`).
2. Создать `lib/i18n/<код>.ts` по образцу `ro.ts` — тип `Dictionary` заставит
   заполнить все ключи, пропуск не соберётся.
3. Зарегистрировать словарь в `dictionaries` (`lib/i18n/index.ts`).
4. Дописать перевод в поля `I18nString` у данных: `products.ts`, `moods.ts`,
   `locations.ts`, `reviews.ts`, `site.ts` (`city`, `taglineByLocale`).

Плюрализация живёт в `common.desserts` каждого словаря — у русского три формы,
у румынского своя схема с предлогом «de» от 20.

## Карта

Leaflet + тайлы CARTO Positron (бесплатно, без API-ключа). Компонент
`components/ui/LeafletMap.tsx` грузится динамически с `ssr: false`.
Цвета тайлов приглушены под палитру CSS-фильтром в `globals.css`.
Координаты точек — в `lib/locations.ts`, поле `coords: [lat, lng]`.

## Что ещё заглушка

Всё помечено в коде комментариями `TODO(...)`:

| Что | Где | Чем заменить |
|---|---|---|
| Фото товаров и секций | `public/images/**` | Реальные снимки (пути прописаны в `lib/products.ts`) |
| КБЖУ и вес — 7 из 8 SKU | `lib/products.ts` | Лабораторные значения. Реальные есть только у «Миндаль-клюква» |
| Точки продаж | `lib/locations.ts` | Реальные адреса, часы, координаты |
| Координаты точек | `lib/locations.ts` | Реальные `[lat, lng]` (карта уже настоящая) |
| Отзывы | `lib/reviews.ts` | Реальные отзывы (или снести вместе с пунктом меню) |
| Приём заказов | `app/api/order/route.ts` | Telegram-бот / почта / CRM |
| Цена коробки | `components/sections/BoxBuilder.tsx` | Сейчас — сумма выбранных вкусов |
| Румынский перевод | `lib/i18n/ro.ts` + поля `ro` в данных | Вычитка носителем языка |

Подробный разбор макета и план — в [PLAN.md](PLAN.md).

## Замена фото

1. Положить файлы в `public/images/products/` под теми же именами, что в `lib/products.ts`.
2. Поменять расширение в `image` с `.svg` на `.jpg`/`.png`/`.webp`.
3. Удалить `scripts/gen-placeholders.mjs` и старые SVG.
