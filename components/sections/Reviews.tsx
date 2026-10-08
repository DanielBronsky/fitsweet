"use client";

import { reviews } from "@/lib/reviews";
import { tileName } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Reviews() {
  const { locale, dict } = useI18n();
  const { byId: productById } = useProducts();

  return (
    <section id="reviews" className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle>{dict.reviews.title}</SectionTitle>

        <ul className="scroll-snap-x -mx-5 mt-9 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:mt-11 lg:gap-5">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="snap-item flex w-[80%] shrink-0 flex-col rounded-card bg-card p-6 sm:w-auto"
            >
              <span className="font-display text-[40px] leading-none text-green-200">“</span>
              <p className="mt-1 flex-1 text-[14px] leading-relaxed text-green-900">{r.text[locale]}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-green-200/50 pt-4">
                <span className="text-[13px] font-semibold text-green-900">{r.name[locale]}</span>
                <span className="rounded-full bg-sage/70 px-3 py-1 text-[11px] text-green-900">
                  {(() => {
                    const p = productById(r.productId);
                    return p ? tileName(p, locale) : "";
                  })()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
