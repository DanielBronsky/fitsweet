import type { SectionKey } from "../sections";

export type NavItem = { label: string; path: string; sub?: boolean; section?: SectionKey };

export const BODY_GROUP = "Основное содержимое · Body";

export const extraNavGroups: { label: string; items: NavItem[] }[] = [
  { label: "Шапка сайта · Header", items: [{ label: "Шапка", path: "/globals/header" }] },
  {
    label: BODY_GROUP,
    items: [
      { label: "Порядок блоков", path: "/globals/layout" },
      { label: "Баннер", path: "/globals/hero", section: "hero" },
      { label: "Выбирайте по настроению", path: "/globals/moodsSection", section: "moods" },
      { label: "Настроения", path: "/collections/moods", sub: true, section: "moods" },
      { label: "Наши десерты", path: "/globals/catalog", section: "catalog" },
      { label: "Товары", path: "/collections/products", sub: true, section: "catalog" },
      { label: "Где купить", path: "/globals/whereSection", section: "where" },
      { label: "Точки продаж", path: "/collections/salePoints", sub: true, section: "where" },
      { label: "Категории точек", path: "/collections/pointCategories", sub: true, section: "where" },
      { label: "Доставка", path: "/globals/deliverySection", section: "delivery" },
      { label: "Соберите коробку", path: "/globals/boxSection", section: "box" },
      { label: "Что говорят о нас", path: "/globals/reviewsSection", section: "reviews" },
      { label: "Отзывы", path: "/collections/reviews", sub: true, section: "reviews" },
      { label: "Больше FitSweet каждый день", path: "/globals/instagramSection", section: "instagram" },
      { label: "Посты Instagram", path: "/collections/instagramPosts", sub: true, section: "instagram" },
    ],
  },
  {
    label: "Товары",
    items: [
      { label: "Все товары", path: "/collections/products" },
      { label: "Категории товаров", path: "/collections/productCategories" },
    ],
  },
  { label: "Медиатека", items: [{ label: "Медиатека", path: "/collections/media" }] },
  {
    label: "Оформление",
    items: [
      { label: "Палитра", path: "/globals/theme" },
      { label: "Шрифты", path: "/globals/typography" },
    ],
  },
  {
    label: "Настройки",
    items: [
      { label: "SEO", path: "/globals/seo" },
      { label: "Администраторы", path: "/collections/users" },
    ],
  },
];
