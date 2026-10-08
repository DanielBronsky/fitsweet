"use client";

import { useRowLabel } from "@payloadcms/ui";
import { pageSections } from "../sections";

export function SectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ block?: string }>();
  const label = pageSections.find((s) => s.key === data?.block)?.label ?? "Выберите блок";
  return (
    <span>
      {(rowNumber ?? 0) + 1} · {label}
    </span>
  );
}
