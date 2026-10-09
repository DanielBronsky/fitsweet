"use client";

import { useEffect, useState } from "react";

export type CustomSectionOption = { id: number; name: string };

let cache: CustomSectionOption[] | null = null;
let pending: Promise<CustomSectionOption[]> | null = null;

const load = () => {
  pending ??= fetch("/api/customSections?depth=0&limit=200&sort=name", { credentials: "include" })
    .then((r) => (r.ok ? r.json() : { docs: [] }))
    .then((d: { docs: { id: number; name?: string }[] }) => {
      cache = d.docs.map((x) => ({ id: x.id, name: x.name || `Раздел ${x.id}` }));
      return cache;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
};

export function useCustomSections() {
  const [list, setList] = useState<CustomSectionOption[]>(cache ?? []);
  useEffect(() => {
    let alive = true;
    load().then((l) => alive && setList(l));
    return () => {
      alive = false;
    };
  }, []);
  return list;
}
