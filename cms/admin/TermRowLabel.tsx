"use client";

import { useRowLabel } from "@payloadcms/ui";

type Row = { title?: { ru?: string }; value?: { ru?: string } };

export function TermRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const text = [data?.title?.ru?.trim(), data?.value?.ru?.trim()].filter(Boolean).join(": ");
  return <span>{text || `№ ${(rowNumber ?? 0) + 1}`}</span>;
}
