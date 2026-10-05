"use client";

import { useRowLabel } from "@payloadcms/ui";
import { sectionAnchors } from "../fields/link";

type Row = { label?: { ru?: string; ro?: string }; target?: string; url?: string };

export function MenuRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const ru = data?.label?.ru?.trim();
  const ro = data?.label?.ro?.trim();
  const block = sectionAnchors.find((a) => a.value === data?.target);
  const where = data?.target === "url" ? data?.url : block ? `«${block.label}»` : "";
  const title = [ru, ro].filter(Boolean).join(" / ") || `Пункт ${(rowNumber ?? 0) + 1}`;
  return (
    <span>
      {title}
      {where && <span style={{ color: "var(--theme-elevation-450)", marginLeft: 8 }}>→ {where}</span>}
    </span>
  );
}
