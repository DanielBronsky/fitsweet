"use client";

import { useFormFields } from "@payloadcms/ui";

type Item = { name?: string; qty?: number; price?: number; sum?: number };

const card = { border: "1px solid var(--theme-elevation-150)", borderRadius: 8, padding: "16px 20px", marginBottom: 20 } as const;
const title = { fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--theme-elevation-500)", margin: "0 0 12px" } as const;
const link = { color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 } as const;

export function OrderSummary() {
  const f = useFormFields(([fields]) => {
    const rows = Number(fields.items?.value ?? 0);
    const items: Item[] = Array.from({ length: rows }, (_, i) => ({
      name: fields[`items.${i}.name`]?.value as string,
      qty: fields[`items.${i}.qty`]?.value as number,
      price: fields[`items.${i}.price`]?.value as number,
      sum: fields[`items.${i}.sum`]?.value as number,
    }));
    return {
      name: fields["customer.name"]?.value as string,
      phone: fields["customer.phone"]?.value as string,
      address: fields["customer.address"]?.value as string,
      comment: fields["customer.comment"]?.value as string,
      items,
      subtotal: fields.subtotal?.value as number,
      shipping: fields.shipping?.value as number,
      total: fields.total?.value as number,
    };
  });

  const tel = f.phone ? `tel:+${f.phone.replace(/\D/g, "")}` : undefined;
  const map = f.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.address}, Chișinău`)}` : undefined;

  return (
    <div>
      <section style={card}>
        <p style={title}>Покупатель</p>
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{f.name || "—"}</p>
        <p style={{ fontSize: 15, margin: "8px 0 0" }}>
          📞 {tel ? <a href={tel} style={link}>{f.phone}</a> : "—"}
        </p>
        <p style={{ fontSize: 15, margin: "6px 0 0" }}>
          📍{" "}
          {map ? (
            <a href={map} target="_blank" rel="noopener noreferrer" style={link}>
              {f.address}
            </a>
          ) : (
            "—"
          )}
        </p>
        {f.comment && (
          <p style={{ fontSize: 14, margin: "12px 0 0", padding: "10px 12px", borderRadius: 6, background: "var(--theme-elevation-50)" }}>
            💬 {f.comment}
          </p>
        )}
      </section>

      <section style={card}>
        <p style={title}>Состав заказа</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            {f.items.map((i, n) => (
              <tr key={n} style={{ borderBottom: "1px solid var(--theme-elevation-100)" }}>
                <td style={{ padding: "8px 0" }}>{i.name}</td>
                <td style={{ padding: "8px 12px", textAlign: "right", whiteSpace: "nowrap", color: "var(--theme-elevation-500)" }}>
                  {i.qty} × {i.price} MDL
                </td>
                <td style={{ padding: "8px 0", textAlign: "right", whiteSpace: "nowrap", fontWeight: 500 }}>{i.sum} MDL</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "grid", gap: 4, marginTop: 12, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--theme-elevation-500)" }}>
            <span>Товары</span>
            <span>{f.subtotal ?? 0} MDL</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--theme-elevation-500)" }}>
            <span>Доставка</span>
            <span>{f.shipping ? `${f.shipping} MDL` : "бесплатно"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, marginTop: 6 }}>
            <span>Итого</span>
            <span>{f.total ?? 0} MDL</span>
          </div>
        </div>
      </section>
    </div>
  );
}
