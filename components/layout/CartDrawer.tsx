"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart, cartTotal, cartCount } from "@/lib/cart";
import { productById, tileName } from "@/lib/products";
import { useI18n } from "@/lib/i18n/context";
import { FREE_DELIVERY_FROM } from "@/lib/delivery";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";

export function CartDrawer() {
  const { locale, dict } = useI18n();
  const { lines, isOpen, close, setQty, remove, clear } = useCart();
  const total = cartTotal(lines);
  const count = cartCount(lines);
  const left = FREE_DELIVERY_FROM - total;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className={`fixed inset-0 z-[60] overflow-hidden ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-green-900/35 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dict.cart.title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-cream transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-green-200/60 px-6 py-5">
          <div>
            <h2 className="heading-caps text-[19px] text-green-900">{dict.cart.title}</h2>
            {count > 0 && (
              <p className="mt-1 text-[13px] text-muted">{dict.common.desserts(count)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="grid h-10 w-10 place-items-center rounded-full text-green-900 hover:bg-green-700/8"
            aria-label={dict.cart.close}
          >
            <CloseIcon className="w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-[15px] text-muted">{dict.cart.empty}</p>
            <Button as="a" href="#catalog" variant="outline" onClick={close}>
              {dict.cart.toCatalog}
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {lines.map((line) => {
                const p = productById(line.id);
                if (!p) return null;
                return (
                  <li key={line.id} className="flex gap-4 border-b border-green-200/40 py-4 last:border-0">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-tile bg-card">
                      <Image src={p.image} alt="" fill className="object-cover" sizes="72px" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[14px] font-medium leading-snug text-green-900">{tileName(p, locale)}</p>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
                          className="shrink-0 text-[12px] text-muted transition-colors hover:text-green-700"
                        >
                          {dict.cart.remove}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 rounded-full border border-green-200 px-1">
                          <button
                            type="button"
                            onClick={() => setQty(line.id, line.qty - 1)}
                            className="grid h-7 w-7 place-items-center rounded-full text-green-900 hover:bg-green-700/8"
                            aria-label={dict.cart.decrease}
                          >
                            −
                          </button>
                          <span className="min-w-[20px] text-center text-[13px] font-semibold">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.id, line.qty + 1)}
                            className="grid h-7 w-7 place-items-center rounded-full text-green-900 hover:bg-green-700/8"
                            aria-label={dict.cart.increase}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[15px] font-bold text-green-900">
                          {dict.common.price(p.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-green-200/60 px-6 py-5">
              {left > 0 && (
                <p className="mb-3 rounded-tile bg-sage/60 px-4 py-3 text-[13px] text-green-900">
                  {dict.cart.freeDeliveryLeft(dict.common.price(left))}
                </p>
              )}
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-[14px] text-muted">{dict.cart.total}</span>
                <span className="text-[26px] font-bold text-green-900">{dict.common.price(total)}</span>
              </div>
              <Button as="a" href="#order" size="lg" className="w-full" onClick={close}>
                {dict.cart.checkout}
              </Button>
              <button
                type="button"
                onClick={clear}
                className="mt-3 w-full text-center text-[12px] text-muted transition-colors hover:text-green-700"
              >
                {dict.cart.clear}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
