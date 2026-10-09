"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { normalizeLayout, type LayoutEntry, type SectionKey } from "../sections";
import { BODY_GROUP, extraNavGroups, type NavItem } from "./extraNavGroups";

let cachedLayout: LayoutEntry[] | null = null;
let cachedCats: Record<number, number> = {};
let cachedCatalogCat: number | null = null;

type RawCustom = { id: number; content?: { blockType?: string; category?: number | { id: number } | null }[] };

export function useNavGroups() {
  const { config } = useConfig();
  const pathname = usePathname();
  const [layout, setLayout] = useState<LayoutEntry[] | null>(cachedLayout);
  const [productCats, setProductCats] = useState<Record<number, number>>(cachedCats);
  const [catalogCat, setCatalogCat] = useState<number | null>(cachedCatalogCat);

  useEffect(() => {
    let alive = true;
    fetch(`${config.serverURL}${config.routes.api}/globals/layout?depth=2`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        const next = normalizeLayout(doc?.blocks ?? []);
        const cats: Record<number, number> = {};
        for (const b of (doc?.blocks ?? []) as { custom?: RawCustom | number | null }[]) {
          const c = b.custom;
          if (!c || typeof c !== "object") continue;
          const block = c.content?.[0];
          const cat = block?.blockType === "products" ? block.category : null;
          const catId = cat && typeof cat === "object" ? cat.id : cat;
          if (catId) cats[c.id] = catId;
        }
        cachedLayout = next;
        cachedCats = cats;
        if (alive) {
          setLayout(next);
          setProductCats(cats);
        }
      })
      .catch(() => {});
    fetch(`${config.serverURL}${config.routes.api}/globals/catalog?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        const cat = doc?.section?.category;
        const id = typeof cat === "number" ? cat : (cat?.id ?? null);
        cachedCatalogCat = id;
        if (alive) setCatalogCat(id);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [config.serverURL, config.routes.api, pathname]);

  const entries = layout ?? normalizeLayout([]);

  return extraNavGroups.map((group) => {
    if (group.label !== BODY_GROUP) return group;
    const fixed = group.items.filter((i) => !i.section);
    const bySection = new Map<SectionKey, NavItem[]>();
    for (const item of group.items.filter((i) => i.section)) {
      const list = bySection.get(item.section!) ?? [];
      list.push(item);
      bySection.set(item.section!, list);
    }
    const ordered: NavItem[] = [];
    let n = 0;
    for (const entry of entries) {
      if (entry.kind === "custom") {
        n += 1;
        ordered.push({ label: `${n} · ${entry.name ?? "Раздел"}`, path: `/collections/customSections/${entry.id}` });
        const cat = productCats[entry.id];
        if (cat) ordered.push({ label: "Товары", path: `/collections/products?where[category][equals]=${cat}`, sub: true });
        continue;
      }
      n += 1;
      const items = bySection.get(entry.key);
      if (!items) continue;
      for (const item of items) {
        if (!item.sub) ordered.push({ ...item, label: `${n} · ${item.label}` });
        else if (entry.key === "catalog" && item.path === "/collections/products" && catalogCat)
          ordered.push({ ...item, path: `/collections/products?where[category][equals]=${catalogCat}` });
        else ordered.push(item);
      }
    }
    return {
      ...group,
      items: [...fixed, ...ordered, { label: "+ Добавить раздел", path: "/collections/customSections/create" }],
    };
  });
}
