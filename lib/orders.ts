import { notifyNewOrder } from "@/cms/telegram/bot";
import { getCms } from "./cms";
import { getShippingRules } from "./delivery-data";
import { isLocale, type Locale } from "./i18n";

export type OrderInput = {
  name?: unknown;
  phone?: unknown;
  address?: unknown;
  comment?: unknown;
  website?: unknown;
  locale?: unknown;
  items?: unknown;
};

export type OrderResult = { ok: true; number: number } | { ok: false; error: "invalid" | "empty" | "spam" };

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

const PHONE_RE = /^\+?[0-9()\-\s]{8,20}$/;

export async function placeOrder(input: OrderInput): Promise<OrderResult> {
  if (text(input.website, 200)) return { ok: false, error: "spam" };

  const locale: Locale = typeof input.locale === "string" && isLocale(input.locale) ? input.locale : "ru";
  const name = text(input.name, 80);
  const phone = text(input.phone, 30);
  const address = text(input.address, 200);
  const comment = typeof input.comment === "string" ? input.comment.trim().slice(0, 600) : "";
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || address.length < 5 || !PHONE_RE.test(phone) || digits.length < 8) return { ok: false, error: "invalid" };

  const wanted = new Map<string, number>();
  for (const raw of Array.isArray(input.items) ? input.items.slice(0, 50) : []) {
    const id = typeof raw?.id === "string" ? raw.id : null;
    const qty = Math.floor(Number(raw?.qty));
    if (id && qty > 0) wanted.set(id, Math.min(99, (wanted.get(id) ?? 0) + qty));
  }
  if (wanted.size === 0) return { ok: false, error: "empty" };

  const cms = await getCms();
  const { docs } = await cms.find({
    collection: "products",
    where: { and: [{ slug: { in: [...wanted.keys()] } }, { active: { not_equals: false } }] },
    depth: 0,
    limit: 100,
  });
  const items = docs
    .filter((p) => p.slug && wanted.has(p.slug))
    .map((p) => {
      const qty = wanted.get(p.slug!)!;
      const price = p.price ?? 0;
      return { product: p.id, name: p.name?.[locale] || p.name?.ru || p.slug!, qty, price, sum: price * qty };
    });
  if (items.length === 0) return { ok: false, error: "empty" };

  const rules = await getShippingRules();
  const subtotal = items.reduce((s, i) => s + i.sum, 0);
  const shipping = rules.freeFrom > 0 && subtotal >= rules.freeFrom ? 0 : rules.price;

  const order = await cms.create({
    collection: "orders",
    overrideAccess: true,
    data: {
      locale,
      customer: { name, phone, address, comment },
      phone,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
    } as never,
  });
  void notifyNewOrder(cms, order).catch((err) => console.error("[telegram] уведомление о заказе:", err));
  return { ok: true, number: order.number ?? 0 };
}
