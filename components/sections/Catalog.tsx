"use client";

import { products } from "@/lib/products";
import { moods } from "@/lib/moods";
import { useMoodFilter } from "@/lib/filter";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";

export function Catalog() {
  const { locale, dict } = useI18n();
  const mood = useMoodFilter((s) => s.mood);
  const setMood = useMoodFilter((s) => s.setMood);

  const visible = mood ? products.filter((p) => p.moods.includes(mood)) : products;
  const moodTitle = moods.find((m) => m.key === mood)?.title[locale];

  return (
    <section id="catalog" className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle>{dict.catalog.title}</SectionTitle>

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

        {/* Один список: слайдер на мобиле, сетка от sm — без дублирования DOM */}
        <div
          className="scroll-snap-x -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-2
            sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0
            md:grid-cols-4 lg:mt-9 lg:grid-cols-8 lg:gap-2.5"
        >
          {visible.map((p) => (
            <div key={p.id} className="snap-item w-[58%] shrink-0 sm:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <div className="mt-9 flex justify-center lg:mt-11">
          <Button
            variant="outline"
            size="md"
            onClick={() => setMood(null)}
            className="px-9"
          >
            {dict.catalog.viewAll}
          </Button>
        </div>
      </Container>
    </section>
  );
}
