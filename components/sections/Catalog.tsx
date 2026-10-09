"use client";

import { useState, type CSSProperties } from "react";
import { useMoodFilter } from "@/lib/filter";
import { useI18n } from "@/lib/i18n/context";
import { useProducts } from "@/lib/products-context";
import type { CatalogData } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { CloseIcon } from "@/components/ui/Icons";

export function Catalog({ data }: { data: CatalogData | null }) {
  const { locale } = useI18n();
  const { products, moods } = useProducts();
  const mood = useMoodFilter((s) => s.mood);
  const setMood = useMoodFilter((s) => s.setMood);
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  const own = data.category ? products.filter((p) => p.category === data.category) : products;
  const visible = mood ? own.filter((p) => p.inMoods !== false && p.moods.includes(mood)) : own;
  const limit = data.more?.initialCount ?? visible.length;
  const collapsed = !expanded && !mood && visible.length > limit;
  const showMore = Boolean(data.more) && (Boolean(mood) || collapsed);

  const onMore = () => {
    if (mood) setMood(null);
    else setExpanded(true);
  };
  const moodTitle = moods.find((m) => m.key === mood)?.title[locale];

  return (
    <section id="catalog" style={{ background: data.background }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle data={data.title} />

        {mood && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setMood(null)}
              className="inline-flex items-center gap-2 rounded-full border border-green-700 bg-green-700/8 px-5 py-2 text-[13px] text-green-900 transition-colors hover:bg-green-700/15"
            >
              {moodTitle}
              <CloseIcon className="w-3.5" />
            </button>
          </div>
        )}

        <div
          className="scroll-snap-x -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 scroll-px-5 sm:scroll-px-0 pb-2
            sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0
            lg:mt-9 lg:gap-2.5"
        >
          {visible.map((p, i) => (
            <div
              key={p.id}
              className={`snap-item w-[58%] shrink-0 sm:w-[calc((100%-1.5rem)/3)] md:w-[calc((100%-2.25rem)/4)] lg:w-[calc((100%-7*0.625rem)/8)] ${
                collapsed && i >= limit ? "hidden" : ""
              }`}
            >
              <ProductCard product={p} style={data.cards} />
            </div>
          ))}
        </div>

        {data.more && showMore && (
          <div className="mt-9 flex justify-center lg:mt-11">
            <button
              type="button"
              onClick={onMore}
              style={
                {
                  background: data.more.background,
                  color: data.more.color,
                  borderColor: data.more.border,
                  fontFamily: data.more.font,
                } as CSSProperties
              }
              className="inline-flex h-10 items-center justify-center rounded-full border px-9 text-[13px] font-medium transition-[filter] duration-200 hover:brightness-95"
            >
              {data.more.text}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
