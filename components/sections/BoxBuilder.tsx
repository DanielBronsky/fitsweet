"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { products, tileName } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

const SIZES = [4, 6, 8, 12];

/** Ассорти: по кругу берём вкусы из каталога, пока не наберём нужное количество */
const assorted = (n: number) => {
  const next: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const id = products[i % products.length].id;
    next[id] = (next[id] ?? 0) + 1;
  }
  return next;
};

/**
 * TODO(бизнес-логика): цена коробки = сумма выбранных вкусов.
 * На макете «8 десертов = 440 MDL», но по реальным ценам сумма всех восьми
 * вкусов = 405 MDL, т.е. 440 — рыба. Заменить формулу, если у коробки
 * будет фиксированный прайс или скидка за объём.
 */
export function BoxBuilder() {
  const { locale, dict } = useI18n();
  const [size, setSize] = useState(8);
  const [picked, setPicked] = useState<Record<string, number>>(() => assorted(8));
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
    [picked],
  );

  const left = size - chosen;

  const changeSize = (next: number) => {
    setSize(next);
    setPicked(assorted(next));
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
    Array.from({ length: qty }, () => products.find((p) => p.id === id)!),
  );

  return (
    <section id="box" className="bg-beige py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle>{dict.box.title}</SectionTitle>

        <div className="mt-9 grid gap-5 lg:mt-11 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.64fr)_minmax(0,0.68fr)] lg:items-stretch">
          {/* Количество */}
          <div className="rounded-card bg-white p-5 lg:p-6">
            <p className="text-[12px] text-muted">{dict.box.chooseQty}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {SIZES.map((s) => (
                <Chip
                  key={s}
                  active={size === s}
                  onClick={() => changeSize(s)}
                  className="h-9 justify-center px-2 text-[11px]"
                >
                  {dict.common.desserts(s)}
                </Chip>
              ))}
            </div>

            <p className="mt-6 text-[12px] text-muted">
              {dict.box.yourBox}{" "}
              <span className="font-semibold text-green-900">
                {dict.common.desserts(chosen)}
              </span>
            </p>

            <button
              type="button"
              onClick={() => setManual((v) => !v)}
              className="mt-2 text-[11.5px] text-green-700 underline underline-offset-4 transition-colors hover:text-green-900"
            >
              {manual ? dict.box.hideManual : dict.box.manualPick}
            </button>
          </div>

          {/* Превью коробки — горизонтальная лента, как на макете */}
          <div className="flex min-w-0 flex-col justify-center rounded-card bg-white p-5 lg:p-6">
            <div className="scroll-snap-x flex w-full items-center gap-2.5 overflow-x-auto pb-1 lg:justify-center lg:overflow-visible lg:pb-0">
              {Array.from({ length: size }, (_, i) => {
                const p = slots[i];
                return (
                  <div
                    key={i}
                    className={`snap-item relative aspect-square w-[68px] shrink-0 overflow-hidden rounded-tile lg:w-auto lg:max-w-[92px] lg:flex-1 ${
                      p ? "bg-card" : "border border-dashed border-green-200"
                    }`}
                    title={p ? tileName(p, locale) : dict.box.freeSlot}
                  >
                    {p && <Image src={p.image} alt="" fill sizes="90px" className="object-cover" />}
                  </div>
                );
              })}
            </div>

            {manual && (
              <ul className="mt-5 grid gap-1.5 border-t border-green-200/50 pt-4">
                {products.map((p) => {
                  const qty = picked[p.id] ?? 0;
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-[12px] text-green-900">
                        {tileName(p, locale)}
                        <span className="ml-2 text-[11px] text-muted">
                          {dict.common.price(p.price)}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1 rounded-full border border-green-200 px-1">
                        <button
                          type="button"
                          onClick={() => dec(p.id)}
                          disabled={qty === 0}
                          className="grid h-6 w-6 place-items-center rounded-full text-green-900 hover:bg-green-700/8 disabled:opacity-30"
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
                          className="grid h-6 w-6 place-items-center rounded-full text-green-900 hover:bg-green-700/8 disabled:opacity-30"
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

          {/* Итого */}
          <div className="flex flex-col items-center justify-center rounded-card bg-white p-5 text-center lg:p-6">
            <p className="text-[12px] text-muted">{dict.box.total}</p>
            <p className="mt-1.5 text-[26px] font-bold leading-none text-green-900">
              {dict.common.price(total)}
            </p>

            <Button size="md" className="mt-5 px-7" onClick={checkout} disabled={left > 0}>
              {left > 0 ? dict.box.addMore(left) : dict.box.checkout}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
