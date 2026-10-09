"use client";

import { useRowLabel } from "@payloadcms/ui";
import { SiteIcon } from "@/components/ui/SiteIcon";

export function FeatureCardRowLabel() {
  const { data, rowNumber } = useRowLabel<{ icon?: string; title?: { ru?: string; ro?: string } }>();
  const title = [data?.title?.ru?.trim(), data?.title?.ro?.trim()].filter(Boolean).join(" / ");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {data?.icon && <SiteIcon name={data.icon} style={{ width: 20, height: 20 }} />}
      {title || `№ ${(rowNumber ?? 0) + 1}`}
    </span>
  );
}
