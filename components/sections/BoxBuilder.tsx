"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { tileName } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { BoxData } from "@/lib/box";

const assorted = (products: Product[], n: number) => {
  const next: Record<string, number> = {};
  if (!products.length) return next;
  for (let i = 0; i < n; i++) {
    const id = products[i % products.length].id;
    next[id] = (next[id] ?? 0) + 1;
  }
  return next;
};

export function BoxBuilder({ data }: { data: BoxData | null }) {
  const { locale, dict } = useI18n();
  const { products: all } = useProducts();
  const products = useMemo(() => all.filter((p) => p.inBox !== false), [all]);
  const [size, setSize] = useState(data?.initial ?? 8);
  const [picked, setPicked] = useState<Record<string, number>>(() => assorted(products, data?.initial ?? 8));
  const [manual, setManual] = useState(false);

  const addMany = useCart((s) => s.addMany);
  const openCart = useCart((s) => s.open);

  const chosen = useMemo(() => Object.values(picked).reduce((a, b) => a + b, 0), [picked]);
  const total = useMemo(
    () =>
      Object.entries(picked).reduce(
        (sum, [id, qty]) => sum + (products.find((p) => p.id === id)?.price ?? 0) * qty,
        0,
      ),
    [picked, products],
  );

  const left = size - chosen;

  const changeSize = (next: number) => {
    setSize(next);
    setPicked(assorted(products, next));
  };

  const inc = (id: string) => {
    if (left <= 0) return;
    setPicked((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
  };

  const dec = (id: string) =>
    setPicked((p) => {
      const qty = (p[id] ?? 0) - 1;
      const next = { ...p };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const checkout = () => {
    const ids = Object.entries(picked).flatMap(([id, qty]) => Array(qty).fill(id) as string[]);
    addMany(ids);
    openCart();
  };

  const slots = Object.entries(picked).flatMap(([id, qty]) =>
    Array.from({ length: qty }, () => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)),
  );

  if (!data || products.length === 0) return null;
  const { texts, style } = data;

  const vars = {
    "--box-panel": style.panel,
    "--box-border": style.border,
    "--box-accent": style.accent,
    "--box-accent-text": style.accentText,
    "--box-text": style.text,
    "--box-muted": style.muted,
  } as CSSProperties;

  return (
    <section id="box" style={{ background: data.background, ...vars }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle data={data.title} />
        {data.subtitle && (
          <p style={{ color: data.subtitle.color }} className="mx-auto mt-5 max-w-[560px] text-pretty text-center text-[15px] leading-relaxed">
            {data.subtitle.text}
          </p>
        )}

        <div className="mt-9 grid gap-5 lg:mt-11 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.64fr)_minmax(0,0.68fr)] lg:items-stretch">
          <div className="rounded-card bg-[var(--box-panel)] p-5 lg:p-6">
            <p className="text-[12px] text-[var(--box-muted)]">{texts.chooseQty}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {data.sizes.map((s) => {
                const on = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => changeSize(s)}
                    className={`inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border px-2 text-[11px] font-medium transition-colors duration-200 ${
                      on
                        ? "border-[var(--box-accent)] bg-[var(--box-accent)] text-[var(--box-accent-text)]"
                        : "border-[var(--box-border)] bg-transparent text-[var(--box-text)] hover:border-[var(--box-accent)]"
                    }`}
                  >
                    {dict.common.desserts(s)}
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-[12px] text-[var(--box-muted)]">
              {texts.yourBox} <span className="font-semibold text-[var(--box-text)]">{dict.common.desserts(chosen)}</span>
            </p>

            <button
              type="button"
              onClick={() => setManual((v) => !v)}
              className="mt-2 text-[11.5px] text-[var(--box-accent)] underline underline-offset-4 transition-[filter] hover:brightness-75"
            >
              {manual ? texts.hideManual : texts.manualPick}
            </button>
          </div>

          <div className="flex min-w-0 flex-col justify-center rounded-card bg-[var(--box-panel)] p-5 lg:p-6">
            <div className="scroll-snap-x flex w-full items-center gap-2.5 overflow-x-auto pb-1 lg:justify-center lg:overflow-visible lg:pb-0">
              {Array.from({ length: size }, (_, i) => {
                const p = slots[i];
                return (
                  <div
                    key={i}
                    className={`snap-item relative aspect-square w-[68px] shrink-0 overflow-hidden rounded-tile lg:w-auto lg:max-w-[92px] lg:flex-1 ${
                      p ? "bg-card" : "border border-dashed border-[var(--box-border)]"
                    }`}
                    title={p ? tileName(p, locale) : dict.box.freeSlot}
                  >
                    {p && <ProductImage product={p} sizes="90px" className="mix-blend-multiply" />}
                  </div>
                );
              })}
            </div>

            {manual && (
              <ul className="mt-5 grid gap-1.5 border-t border-[color-mix(in_srgb,var(--box-border)_50%,transparent)] pt-4">
                {products.map((p) => {
                  const qty = picked[p.id] ?? 0;
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--box-text)]">
                        {tileName(p, locale)}
                        <span className="ml-2 text-[11px] text-[var(--box-muted)]">
                          {dict.common.price(p.price)}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--box-border)] px-1">
                        <button
                          type="button"
                          onClick={() => dec(p.id)}
                          disabled={qty === 0}
                          className="grid h-6 w-6 place-items-center rounded-full text-[var(--box-text)] hover:bg-[color-mix(in_srgb,var(--box-accent)_8%,transparent)] disabled:opacity-30"
                          aria-label={dict.box.removeOne(tileName(p, locale))}
                        >
                          −
                        </button>
                        <span className="min-w-[16px] text-center text-[11.5px] font-semibold">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => inc(p.id)}
                          disabled={left <= 0}
                          className="grid h-6 w-6 place-items-center rounded-full text-[var(--box-text)] hover:bg-[color-mix(in_srgb,var(--box-accent)_8%,transparent)] disabled:opacity-30"
                          aria-label={dict.box.addOne(tileName(p, locale))}
                        >
                          +
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-col items-center justify-center rounded-card bg-[var(--box-panel)] p-5 text-center lg:p-6">
            <p className="text-[12px] text-[var(--box-muted)]">{texts.total}</p>
            <p className="mt-1.5 text-[26px] font-bold leading-none text-[var(--box-text)]">{dict.common.price(total)}</p>

            <button
              type="button"
              onClick={checkout}
              disabled={left > 0}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[var(--box-accent)] px-7 text-[13px] font-medium text-[var(--box-accent-text)] transition-[filter,opacity] duration-200 hover:brightness-90 disabled:pointer-events-none disabled:opacity-45"
            >
              {left > 0 ? texts.addMore.replace("{n}", String(left)) : texts.checkout}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
