# FitSweet

Лендинг ПП-десертов FitSweet — Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.
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
