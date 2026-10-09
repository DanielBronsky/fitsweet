"use client";

import { useEffect, useState } from "react";
import { useRowLabel } from "@payloadcms/ui";
import { pageSections } from "../sections";

export function SectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ block?: string; custom?: number | { name?: string } | null }>();
  const [customName, setCustomName] = useState<string | null>(null);
  const customId = data?.block === "custom" ? (typeof data.custom === "object" ? null : data.custom) : null;

  useEffect(() => {
    if (!customId) return;
    let alive = true;
    fetch(`/api/customSections/${customId}?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => alive && setCustomName(doc?.name ?? null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [customId]);

  const label =
    data?.block === "custom"
      ? (customName ?? (typeof data.custom === "object" ? data.custom?.name : null) ?? "…")
      : (pageSections.find((s) => s.key === data?.block)?.label ?? "Выберите блок");
  return (
    <span>
      {(rowNumber ?? 0) + 1} · {label}
    </span>
  );
}
