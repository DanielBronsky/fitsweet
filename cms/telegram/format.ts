import type { InlineKeyboard } from "./api";

export type OrderStatus = "new" | "accepted" | "done" | "cancelled";

export type OrderView = {
  id: number;
  number: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string; address: string; comment?: string | null };
  items: { name: string; qty: number; sum: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  acceptedBy?: string | null;
  acceptedAt?: string | null;
  closedBy?: string | null;
  closedAt?: string | null;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const time = (iso?: string | null) =>
  iso
    ? new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Chisinau", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
        new Date(iso),
      )
    : "";

const money = (n: number) => `${n} MDL`;

function statusLine(o: OrderView) {
  if (o.status === "new") return "🆕 <b>Новый — ждёт, кто примет</b>";
  if (o.status === "accepted") return `👌 <b>Принят</b> · ${esc(o.acceptedBy ?? "менеджер")} · ${time(o.acceptedAt)}`;
  const who = o.closedBy ?? o.acceptedBy;
  if (o.status === "done") return `✅ <b>Выполнен</b>${who ? ` · ${esc(who)}` : ""} · ${time(o.closedAt)}`;
  return `✖️ <b>Отменён</b>${who ? ` · ${esc(who)}` : ""} · ${time(o.closedAt)}`;
}

export function orderText(o: OrderView) {
  const c = o.customer;
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.address}, Chișinău`)}`;
  const lines = [
    `🛍 <b>Заказ №${o.number}</b> · ${time(o.createdAt)}`,
    "",
    `👤 ${esc(c.name)}`,
    `📞 ${esc(c.phone)}`,
    `📍 <a href="${map}">${esc(c.address)}</a>`,
    ...(c.comment ? [`💬 ${esc(c.comment)}`] : []),
    "",
    ...o.items.map((i) => `• ${esc(i.name)} × ${i.qty} — ${money(i.sum)}`),
    "",
    `Товары: ${money(o.subtotal)}`,
    `Доставка: ${o.shipping === 0 ? "бесплатно" : money(o.shipping)}`,
    `<b>Итого: ${money(o.total)}</b>`,
    "",
    statusLine(o),
  ];
  return lines.join("\n");
}

export function orderKeyboard(o: OrderView, adminUrl?: string | null): InlineKeyboard {
  const rows: InlineKeyboard["inline_keyboard"] = [];
  if (o.status === "new") rows.push([{ text: "✅ Принять заказ", callback_data: `o:${o.id}:accept` }]);
  if (o.status === "accepted")
    rows.push([
      { text: "✅ Выполнен", callback_data: `o:${o.id}:done` },
      { text: "✖️ Отменить", callback_data: `o:${o.id}:cancel` },
    ]);
  if (adminUrl) rows.push([{ text: "Открыть в админке", url: adminUrl }]);
  return { inline_keyboard: rows };
}
