"use client";

import { useRowLabel } from "@payloadcms/ui";

const short: Record<string, string> = {
  Monday: "Пн",
  Tuesday: "Вт",
  Wednesday: "Ср",
  Thursday: "Чт",
  Friday: "Пт",
  Saturday: "Сб",
  Sunday: "Вс",
};

type Row = { days?: string[]; opens?: string; closes?: string };

export function HoursRowLabel() {
  const { data, rowNumber } = useRowLabel<Row>();
  const days = (data?.days ?? []).map((d) => short[d] ?? d).join(", ");
  const time = data?.opens && data?.closes ? `${data.opens}–${data.closes}` : "";
  return <span>{[days, time].filter(Boolean).join(" · ") || `Строка ${(rowNumber ?? 0) + 1}`}</span>;
}
