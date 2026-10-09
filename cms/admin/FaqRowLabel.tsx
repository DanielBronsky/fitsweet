"use client";

import { useRowLabel } from "@payloadcms/ui";

export function FaqRowLabel() {
  const { data, rowNumber } = useRowLabel<{ question?: { ru?: string } }>();
  return <span>{data?.question?.ru?.trim() || `Вопрос ${(rowNumber ?? 0) + 1}`}</span>;
}
