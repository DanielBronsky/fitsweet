"use client";

import type { CSSProperties } from "react";
import { moodProductNames } from "@/lib/moods";
import { useProducts } from "@/lib/products-context";
import { useMoodFilter } from "@/lib/filter";
import { useI18n } from "@/lib/i18n/context";
import type { MoodsData } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Moods({ data }: { data: MoodsData | null }) {
  const { locale } = useI18n();
  const { products: all, moods } = useProducts();
  const products = all.filter((p) => p.inMoods !== false);
  const active = useMoodFilter((s) => s.mood);
  const setMood = useMoodFilter((s) => s.setMood);

  if (!data || moods.length === 0) return null;

  const pick = (key: string) => {
    setMood(active === key ? null : key);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const cols = moods.length >= 5 ? "lg:grid-cols-5" : moods.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section id="about" style={{ background: data.background }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle data={data.title} />

        <div
          className={`scroll-snap-x -mx-5 mt-9 flex gap-4 overflow-x-auto px-5 scroll-px-5 sm:scroll-px-0 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:mt-11 ${cols}`}
        >
          {moods.map((m) => {
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => pick(m.key)}
                aria-pressed={isActive}
                style={{ background: data.cards.background, borderColor: isActive ? data.cards.activeBorder : "transparent" }}
                className={`snap-item flex w-[70%] shrink-0 flex-col items-center rounded-card border p-4 text-center transition-all duration-300 hover:shadow-lift sm:w-auto lg:p-5 ${
                  isActive ? "shadow-lift" : ""
                }`}
              >
                <div className="relative aspect-[13/11] w-full overflow-hidden rounded-tile">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.thumb?.src ?? m.image}
                    srcSet={m.thumb?.srcSet}
                    sizes={m.thumb ? "(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 220px" : undefined}
                    width={m.thumb?.width ?? 440}
                    height={m.thumb?.height ?? 372}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <h3
                  style={{ color: data.cards.titleColor, fontFamily: data.cards.titleFont, fontWeight: data.cards.titleWeight ?? 600 }}
                  className="mt-4 text-[12.5px] leading-snug"
                >
                  {m.title[locale]}
                </h3>
                {data.cards.showList && (
                  <p style={{ color: data.cards.listColor }} className="mt-1.5 text-[10.5px] leading-relaxed">
                    {moodProductNames(products, m.key, locale)}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {data.more && (
          <div className="mt-9 flex justify-center lg:mt-11">
            <a
              href="#catalog"
              onClick={() => setMood(null)}
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
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}
