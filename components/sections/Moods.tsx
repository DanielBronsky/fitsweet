"use client";

import Image from "next/image";
import { moods, moodProductNames } from "@/lib/moods";
import { useMoodFilter } from "@/lib/filter";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";

export function Moods() {
  const { locale, dict } = useI18n();
  const active = useMoodFilter((s) => s.mood);
  const setMood = useMoodFilter((s) => s.setMood);

  const pick = (key: (typeof moods)[number]["key"]) => {
    setMood(active === key ? null : key);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="bg-beige py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle>{dict.moods.title}</SectionTitle>

        <div className="scroll-snap-x -mx-5 mt-9 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:mt-11 lg:grid-cols-5">
          {moods.map((m) => {
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => pick(m.key)}
                aria-pressed={isActive}
                className={`snap-item flex w-[70%] shrink-0 flex-col items-center rounded-card border bg-white p-4 text-center transition-all duration-300 hover:shadow-lift sm:w-auto lg:p-5
                  ${isActive ? "border-green-700 shadow-lift" : "border-transparent"}`}
              >
                <div className="relative aspect-[13/11] w-full overflow-hidden rounded-tile">
                  <Image
                    src={m.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 220px"
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-4 text-[12.5px] font-semibold leading-snug text-green-900">
                  {m.title[locale]}
                </h3>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
                  {moodProductNames(m.key, locale)}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-9 flex justify-center lg:mt-11">
          <Button as="a" href="#catalog" variant="outline" onClick={() => setMood(null)} className="px-9">
            {dict.moods.viewAll}
          </Button>
        </div>
      </Container>
    </section>
  );
}
