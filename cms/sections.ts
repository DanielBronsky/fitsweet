export const pageSections = [
  { key: "hero", label: "Баннер" },
  { key: "moods", label: "Выбирайте по настроению" },
  { key: "catalog", label: "Наши десерты" },
  { key: "where", label: "Где купить" },
  { key: "delivery", label: "Доставка" },
  { key: "box", label: "Соберите коробку" },
  { key: "reviews", label: "Отзывы" },
  { key: "instagram", label: "Instagram" },
  { key: "order", label: "Оформить заказ" },
  { key: "finalCta", label: "Финальный призыв" },
] as const;

export type SectionKey = (typeof pageSections)[number]["key"];

export const defaultSectionOrder = pageSections.map((s) => s.key) as SectionKey[];

export function normalizeOrder(keys: (string | null | undefined)[] | null | undefined): SectionKey[] {
  const known = new Set<string>(defaultSectionOrder);
  const seen = new Set<string>();
  const out: SectionKey[] = [];
  for (const k of keys ?? []) {
    if (k && known.has(k) && !seen.has(k)) {
      seen.add(k);
      out.push(k as SectionKey);
    }
  }
  for (const k of defaultSectionOrder) if (!seen.has(k)) out.push(k);
  return out;
}
