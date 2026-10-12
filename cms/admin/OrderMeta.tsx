"use client";

import { useEffect, useState } from "react";
import { useConfig, useFormFields } from "@payloadcms/ui";

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : null;

const idOf = (v: unknown) => (v && typeof v === "object" ? (v as { id: number }).id : (v as number | null | undefined) ?? null);

function useManagerName(value: unknown) {
  const { config } = useConfig();
  const id = idOf(value);
  const inline = value && typeof value === "object" ? (value as { name?: string }).name : undefined;
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    if (!id || inline) return;
    let alive = true;
    fetch(`${config.serverURL}${config.routes.api}/managers/${id}?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setName(d?.name ?? null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id, inline, config.serverURL, config.routes.api]);
  return inline ?? name ?? (id ? "…" : null);
}

const label = { fontSize: 12, color: "var(--theme-elevation-500)", margin: 0 } as const;
const value = { fontSize: 14, margin: "2px 0 0" } as const;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={label}>{title}</p>
      <p style={value}>{children}</p>
    </div>
  );
}

export function OrderMeta() {
  const f = useFormFields(([fields]) => ({
    number: fields.number?.value as string | undefined,
    createdAt: fields.createdAt?.value as string | undefined,
    acceptedBy: fields.acceptedBy?.value,
    acceptedAt: fields.acceptedAt?.value as string | undefined,
    closedBy: fields.closedBy?.value,
    closedAt: fields.closedAt?.value as string | undefined,
    status: fields.status?.value as string | undefined,
    locale: fields.locale?.value as string | undefined,
  }));
  const accepted = useManagerName(f.acceptedBy);
  const closed = useManagerName(f.closedBy);
  const closedTitle = f.status === "cancelled" ? "Отменил(а)" : "Закрыл(а)";

  return (
    <div style={{ margin: "4px 0 24px", paddingTop: 16, borderTop: "1px solid var(--theme-elevation-100)" }}>
      {f.number && <Row title="Номер заказа">№{f.number}</Row>}
      {f.createdAt && <Row title="Создан">{fmt(f.createdAt)}</Row>}
      <Row title="Принял(а)">{f.acceptedAt || accepted ? [accepted ?? "из админки", fmt(f.acceptedAt)].filter(Boolean).join(" · ") : "—"}</Row>
      {(f.closedAt || closed) && <Row title={closedTitle}>{[closed ?? "из админки", fmt(f.closedAt)].filter(Boolean).join(" · ")}</Row>}
      {f.locale && <Row title="Язык сайта">{f.locale === "ro" ? "Română" : "Русский"}</Row>}
    </div>
  );
}
