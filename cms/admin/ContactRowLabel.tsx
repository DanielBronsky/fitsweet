"use client";

import { useRowLabel } from "@payloadcms/ui";
import { contactTypes } from "../contacts";

type Row = { type?: string; value?: string; text?: { ru?: string } };

export function ContactRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const type = contactTypes.find((t) => t.value === data?.type)?.label ?? "Контакт";
  const value = data?.text?.ru?.trim() || data?.value?.trim();
  return <span>{value ? `${type} · ${value}` : `${type} ${(rowNumber ?? 0) + 1}`}</span>;
}
