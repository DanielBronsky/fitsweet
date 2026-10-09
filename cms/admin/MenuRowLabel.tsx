"use client";

import { useRowLabel } from "@payloadcms/ui";
import { sectionAnchors } from "../fields/link";
import { useCustomSections } from "./useCustomSections";

type Row = { label?: { ru?: string; ro?: string }; target?: string; url?: string; section?: number | { id: number } | null };

export function MenuRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const ru = data?.label?.ru?.trim();
  const ro = data?.label?.ro?.trim();
  const sections = useCustomSections();
  const block = sectionAnchors.find((a) => a.value === data?.target);
  const sectionId = data?.section && typeof data.section === "object" ? data.section.id : data?.section;
  const custom = data?.target === "section" ? sections.find((s) => s.id === sectionId) : undefined;
  const where =
    data?.target === "url" ? data?.url : block ? `«${block.label}»` : custom ? `«${custom.name}»` : "";
  const title = [ru, ro].filter(Boolean).join(" / ") || `Пункт ${(rowNumber ?? 0) + 1}`;
  return (
    <span>
      {title}
      {where && <span style={{ color: "var(--theme-elevation-450)", marginLeft: 8 }}>→ {where}</span>}
    </span>
  );
}
