"use client";

import { useRowLabel } from "@payloadcms/ui";

type Row = { name?: string; qty?: number; sum?: number };

export function OrderItemRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  if (!data?.name) return <span>Товар {(rowNumber ?? 0) + 1}</span>;
  return (
    <span>
      {data.name} × {data.qty ?? 0}
      {typeof data.sum === "number" ? ` — ${data.sum} MDL` : ""}
    </span>
  );
}
