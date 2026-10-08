"use client";

import { useRowLabel } from "@payloadcms/ui";
import { SiteIcon } from "@/components/ui/SiteIcon";

type Row = { text?: { ru?: string; ro?: string }; icon?: string };

export function FeatureRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const title = [data?.text?.ru?.trim(), data?.text?.ro?.trim()].filter(Boolean).join(" / ");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {data?.icon && data.icon !== "custom" && <SiteIcon name={data.icon} style={{ width: 20, height: 20 }} />}
      {data?.icon === "custom" && <span style={{ fontSize: 11, opacity: 0.6 }}>[своя]</span>}
      {title || `№ ${(rowNumber ?? 0) + 1}`}
    </span>
  );
}
