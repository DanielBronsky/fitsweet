"use client";

import { useRowLabel } from "@payloadcms/ui";

type Row = { text?: { ru?: string; ro?: string } };

export function TextRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const title = [data?.text?.ru?.trim(), data?.text?.ro?.trim()].filter(Boolean).join(" / ");
  return <span>{title || `№ ${(rowNumber ?? 0) + 1}`}</span>;
}
