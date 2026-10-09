import type { ReviewsData } from "@/lib/reviews";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Reviews({ data }: { data: ReviewsData | null }) {
  if (!data) return null;
  const { cards } = data;
  const cols = data.items.length === 1 ? "sm:grid-cols-1 sm:max-w-[420px] sm:mx-auto" : data.items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <section id="reviews" style={{ background: data.background }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle data={data.title} />
        {data.subtitle && (
          <p style={{ color: data.subtitle.color }} className="mx-auto mt-5 max-w-[560px] text-pretty text-center text-[15px] leading-relaxed">
            {data.subtitle.text}
          </p>
        )}

        <ul
          className={`scroll-snap-x -mx-5 mt-9 flex gap-4 overflow-x-auto px-5 scroll-px-5 sm:scroll-px-0 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 lg:mt-11 lg:gap-5 ${cols}`}
        >
          {data.items.map((r) => (
            <li
              key={r.id}
              style={{ background: cards.background }}
              className="snap-item flex w-[80%] shrink-0 flex-col rounded-card p-6 sm:w-auto"
            >
              <span aria-hidden style={{ color: cards.quoteColor }} className="font-display text-[40px] leading-none">
                “
              </span>
              <p style={{ color: cards.textColor, fontFamily: cards.font }} className="mt-1 flex-1 text-[14px] leading-relaxed">
                {r.text}
              </p>
              <div
                style={{ borderColor: `color-mix(in srgb, ${cards.quoteColor} 50%, transparent)` }}
                className="mt-5 flex items-center justify-between gap-3 border-t pt-4"
              >
                <span style={{ color: cards.nameColor }} className="text-[13px] font-semibold">
                  {r.author}
                </span>
                {r.product && (
                  <span
                    style={{ background: cards.chipBackground, color: cards.chipColor }}
                    className="truncate rounded-full px-3 py-1 text-[11px]"
                  >
                    {r.product}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
