"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { normalizeOrder, type SectionKey } from "../sections";
import { BODY_GROUP, extraNavGroups, type NavItem } from "./extraNavGroups";

let cachedOrder: SectionKey[] | null = null;

export function useNavGroups() {
  const { config } = useConfig();
  const pathname = usePathname();
  const [order, setOrder] = useState<SectionKey[] | null>(cachedOrder);

  useEffect(() => {
    let alive = true;
    fetch(`${config.serverURL}${config.routes.api}/globals/layout?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        const next = normalizeOrder((doc?.blocks ?? []).map((b: { block?: string }) => b.block));
        cachedOrder = next;
        if (alive) setOrder(next);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [config.serverURL, config.routes.api, pathname]);

  const sectionOrder = order ?? normalizeOrder([]);

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
    for (const key of sectionOrder) {
      const items = bySection.get(key);
      if (!items) continue;
      n += 1;
      for (const item of items) ordered.push(item.sub ? item : { ...item, label: `${n} · ${item.label}` });
    }
    return { ...group, items: [...fixed, ...ordered] };
  });
}
