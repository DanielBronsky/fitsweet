"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCart, cartTotal, cartCount } from "@/lib/cart";
import { tileName } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";

type Status = "idle" | "sending" | "done" | "error";

const noop = () => () => {};

const field =
  "h-12 w-full rounded-full border border-green-200 bg-white px-5 text-[14px] text-green-900 " +
  "placeholder:text-muted/70 transition-colors focus:border-green-700 focus:outline-none";

export function Checkout() {
  const { locale, dict } = useI18n();
  const { lines, clear, setQty } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");

  const { byId: productById, shipping: rules } = useProducts();
  const subtotal = cartTotal(lines, productById);
  const count = cartCount(lines);
  const shipping = subtotal === 0 || (rules.freeFrom > 0 && subtotal >= rules.freeFrom) ? 0 : rules.price;
  const total = subtotal + shipping;
  const home = `/${locale}`;
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  const errors: Record<string, string> = {
    invalid: dict.order.errorInvalid,
    empty: dict.order.errorEmpty,
    rate: dict.order.errorRate,
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          address: fd.get("address"),
          comment: fd.get("comment"),
          website: fd.get("website"),
          locale,
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { number?: string; error?: string };
      if (!res.ok) throw new Error(errors[data.error ?? ""] ?? dict.order.errorGeneric);
      setNumber(data.number ?? "");
      setStatus("done");
      clear();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : dict.order.errorUnknown);
    }
  };

  if (status === "done") {
    return (
      <section className="bg-beige py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-[560px] rounded-card bg-cream px-6 py-10 text-center sm:px-10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage text-[26px] text-green-900">✓</div>
            <h1 className="heading-caps mt-5 text-[22px] text-green-900 sm:text-[26px]">{dict.order.successTitle(number)}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{dict.order.successText}</p>
            <Button as={Link} href={home} size="lg" className="mt-7">
              {dict.order.backToShop}
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-beige py-12 sm:py-14 lg:py-16">
      <Container>
        <h1 className="heading-caps text-[24px] text-green-900 sm:text-[28px]">{dict.order.pageTitle}</h1>

        {!mounted ? (
          <div className="mt-8 h-[420px] animate-pulse rounded-card bg-cream" />
        ) : count === 0 ? (
          <div className="mt-8 max-w-[560px] rounded-card bg-cream p-6 sm:p-8">
            <p className="text-[15px] leading-relaxed text-muted">{dict.order.emptyCart}</p>
            <Button as={Link} href={`${home}#catalog`} size="lg" className="mt-6">
              {dict.order.backToShop}
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <form onSubmit={onSubmit} className="rounded-card bg-cream p-6 lg:p-8">
              <div className="grid gap-3.5">
                <label className="grid gap-1.5">
                  <span className="pl-1 text-[12.5px] text-muted">{dict.order.name}</span>
                  <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} placeholder={dict.order.namePlaceholder} />
                </label>
                <label className="grid gap-1.5">
                  <span className="pl-1 text-[12.5px] text-muted">{dict.order.phone}</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    pattern="\+?[0-9()\-\s]{8,20}"
                    className={field}
                    placeholder={dict.order.phonePlaceholder}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="pl-1 text-[12.5px] text-muted">{dict.order.address}</span>
                  <input name="address" required minLength={5} maxLength={200} autoComplete="street-address" className={field} placeholder={dict.order.addressPlaceholder} />
                </label>
                <label className="grid gap-1.5">
                  <span className="pl-1 text-[12.5px] text-muted">{dict.order.comment}</span>
                  <textarea
                    name="comment"
                    rows={3}
                    maxLength={600}
                    className="w-full resize-none rounded-card border border-green-200 bg-white px-5 py-3.5 text-[14px] text-green-900 placeholder:text-muted/70 transition-colors focus:border-green-700 focus:outline-none"
                    placeholder={dict.order.commentPlaceholder}
                  />
                </label>
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              </div>

              {status === "error" && <p className="mt-5 rounded-tile bg-blush/50 px-4 py-3 text-[13.5px] text-choco">{error}</p>}

              <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "sending"}>
                {status === "sending" ? dict.order.sending : dict.order.submit(dict.common.price(total))}
              </Button>
              <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted">{dict.order.agree}</p>
            </form>

            <aside className="rounded-card bg-cream p-6 lg:sticky lg:top-24 lg:p-8">
              <h2 className="heading-caps text-[15px] text-green-900">{dict.order.yourOrder}</h2>
              <ul className="mt-4 grid gap-3">
                {lines.map((l) => {
                  const p = productById(l.id);
                  if (!p) return null;
                  return (
                    <li key={l.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-tile bg-card">
                        <ProductImage product={p} sizes="48px" className="mix-blend-multiply" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] text-green-900">{tileName(p, locale)}</p>
                        <div className="mt-1 flex items-center gap-1 text-[12px] text-muted">
                          <button
                            type="button"
                            onClick={() => setQty(l.id, l.qty - 1)}
                            className="grid h-6 w-6 place-items-center rounded-full border border-green-200 text-green-900 hover:border-green-700"
                            aria-label={dict.cart.decrease}
                          >
                            −
                          </button>
                          <span className="min-w-[20px] text-center font-semibold text-green-900">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(l.id, l.qty + 1)}
                            className="grid h-6 w-6 place-items-center rounded-full border border-green-200 text-green-900 hover:border-green-700"
                            aria-label={dict.cart.increase}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="shrink-0 text-[14px] font-medium text-green-900">{dict.common.price(p.price * l.qty)}</span>
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
            </aside>
          </div>
        )}
      </Container>
    </section>
  );
}
