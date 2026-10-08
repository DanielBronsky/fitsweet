"use client";

import { useState } from "react";
import { useCart, cartTotal, cartCount } from "@/lib/cart";
import { productName, tileName } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n/context";
import { FREE_DELIVERY_FROM, DELIVERY_PRICE } from "@/lib/delivery";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "done" | "error";

const field =
  "h-12 w-full rounded-full border border-green-200 bg-cream px-5 text-[14px] text-green-900 " +
  "placeholder:text-muted/70 transition-colors focus:border-green-700 focus:outline-none";

export function OrderForm() {
  const { locale, dict } = useI18n();
  const { lines, clear } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const { byId: productById } = useProducts();
  const subtotal = cartTotal(lines, productById);
  const count = cartCount(lines);
  const shipping = subtotal >= FREE_DELIVERY_FROM || subtotal === 0 ? 0 : DELIVERY_PRICE;
  const total = subtotal + shipping;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatus("sending");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      address: String(fd.get("address") ?? "").trim(),
      comment: String(fd.get("comment") ?? "").trim(),
      items: lines.map((l) => ({
        id: l.id,
        name: (() => {
          const p = productById(l.id);
          return p ? productName(p, locale) : l.id;
        })(),
        qty: l.qty,
        price: productById(l.id)?.price ?? 0,
      })),
      subtotal,
      shipping,
      total,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? dict.order.errorGeneric);

      setStatus("done");
      clear();
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : dict.order.errorUnknown);
    }
  };

  return (
    <section id="order" className="bg-beige py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle>{dict.order.title}</SectionTitle>

        <div className="mx-auto mt-9 grid max-w-[980px] gap-6 lg:mt-11 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <form onSubmit={onSubmit} className="rounded-card bg-cream p-6 lg:p-8">
            <div className="grid gap-3.5">
              <label className="grid gap-1.5">
                <span className="pl-1 text-[12.5px] text-muted">{dict.order.name}</span>
                <input name="name" required minLength={2} className={field} placeholder={dict.order.namePlaceholder} />
              </label>

              <label className="grid gap-1.5">
                <span className="pl-1 text-[12.5px] text-muted">{dict.order.phone}</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9+()\-\s]{8,20}"
                  className={field}
                  placeholder={dict.order.phonePlaceholder}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="pl-1 text-[12.5px] text-muted">{dict.order.address}</span>
                <input name="address" required minLength={5} className={field} placeholder={dict.order.addressPlaceholder} />
              </label>

              <label className="grid gap-1.5">
                <span className="pl-1 text-[12.5px] text-muted">{dict.order.comment}</span>
                <textarea
                  name="comment"
                  rows={3}
                  className="w-full resize-none rounded-card border border-green-200 bg-cream px-5 py-3.5 text-[14px] text-green-900 placeholder:text-muted/70 transition-colors focus:border-green-700 focus:outline-none"
                  placeholder={dict.order.commentPlaceholder}
                />
              </label>
            </div>

            {status === "done" && (
              <p className="mt-5 rounded-tile bg-sage/70 px-4 py-3 text-[13.5px] text-green-900">
                {dict.order.success}
              </p>
            )}
            {status === "error" && (
              <p className="mt-5 rounded-tile bg-blush/50 px-4 py-3 text-[13.5px] text-choco">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={status === "sending" || count === 0}
            >
              {status === "sending"
                ? dict.order.sending
                : count === 0
                  ? dict.order.needItems
                  : dict.order.submit(dict.common.price(total))}
            </Button>

            <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
              {dict.order.agree}
            </p>
          </form>

          <aside className="rounded-card bg-cream p-6 lg:p-8">
            <h3 className="heading-caps text-[15px] text-green-900">{dict.order.yourOrder}</h3>

            {count === 0 ? (
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                {dict.order.emptyCart}
              </p>
            ) : (
              <>
                <ul className="mt-4 grid gap-2">
                  {lines.map((l) => {
                    const p = productById(l.id);
                    if (!p) return null;
                    return (
                      <li key={l.id} className="flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="min-w-0 flex-1 truncate text-green-900">
                          {tileName(p, locale)}
                          <span className="ml-1.5 text-muted">× {l.qty}</span>
                        </span>
                        <span className="shrink-0 font-medium text-green-900">
                          {dict.common.price(p.price * l.qty)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-5 grid gap-2 border-t border-green-200/60 pt-4 text-[13px]">
                  <div className="flex justify-between text-muted">
                    <span>{dict.common.desserts(count)}</span>
                    <span>{dict.common.price(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>{dict.order.deliveryRow}</span>
                    <span>{shipping === 0 ? dict.order.free : dict.common.price(shipping)}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between border-t border-green-200/60 pt-3">
                    <span className="text-[14px] text-green-900">{dict.order.total}</span>
                    <span className="text-[24px] font-bold text-green-900">{dict.common.price(total)}</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}
