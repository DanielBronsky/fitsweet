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

export type LayoutEntry = { kind: "builtin"; key: SectionKey } | { kind: "custom"; id: number; name?: string };

type RawBlock = { block?: string | null; custom?: number | { id: number; name?: string | null } | null };

export function normalizeLayout(blocks: RawBlock[] | null | undefined): LayoutEntry[] {
  const known = new Set<string>(defaultSectionOrder);
  const seenBuiltin = new Set<string>();
  const seenCustom = new Set<number>();
  const out: LayoutEntry[] = [];
  for (const b of blocks ?? []) {
    if (b.block === "custom") {
      const id = typeof b.custom === "object" ? b.custom?.id : b.custom;
      if (!id || seenCustom.has(id)) continue;
      seenCustom.add(id);
      out.push({ kind: "custom", id, name: typeof b.custom === "object" ? (b.custom?.name ?? undefined) : undefined });
    } else if (b.block && known.has(b.block) && !seenBuiltin.has(b.block)) {
      seenBuiltin.add(b.block);
      out.push({ kind: "builtin", key: b.block as SectionKey });
    }
  }
  for (const k of defaultSectionOrder) if (!seenBuiltin.has(k)) out.push({ kind: "builtin", key: k });
  return out;
}
