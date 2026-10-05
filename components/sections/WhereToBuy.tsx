"use client";

import { useState } from "react";
import { locationCategoryKeys, salePoints } from "@/lib/locations";
import { useI18n } from "@/lib/i18n/context";
import type { LocationCategory } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import { ClockIcon, PinIcon } from "@/components/ui/Icons";

const LeafletMap = dynamic(
  () => import("@/components/ui/LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] w-full animate-pulse rounded-card bg-sage lg:aspect-auto lg:h-full lg:min-h-[420px]" />
    ),
  },
);

const PREVIEW = 4;

export function WhereToBuy() {
  const { locale, dict } = useI18n();
  const [cat, setCat] = useState<LocationCategory | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const filtered = cat === "all" ? salePoints : salePoints.filter((p) => p.category === cat);
  const visible = expanded ? filtered : filtered.slice(0, PREVIEW);

  return (
    <section id="where" className="bg-beige py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle align="left">{dict.where.title}</SectionTitle>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
          <div>
            <p className="max-w-[430px] text-[15px] leading-relaxed text-muted">
              {dict.where.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {locationCategoryKeys.map((key) => (
                <Chip
                  key={key}
                  active={cat === key}
                  onClick={() => {
                    setCat(key);
                    setExpanded(false);
                    setActive(null);
                  }}
                >
                  {dict.where.categories[key]}
                </Chip>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="mt-8 rounded-card bg-white px-5 py-6 text-[14px] text-muted">
                {dict.where.empty}
              </p>
            ) : (
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {visible.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(p.id)}
                      onFocus={() => setActive(p.id)}
                      onClick={() => setActive(p.id)}
                      className={`flex w-full items-start gap-3 rounded-tile border bg-white px-4 py-3.5 text-left transition-colors duration-200 ${
                        active === p.id ? "border-green-700" : "border-transparent hover:border-green-200"
                      }`}
                    >
                      <PinIcon className="mt-0.5 w-[18px] shrink-0 text-green-700" />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold text-green-900">{p.name}</span>
                        <span className="mt-0.5 block text-[12.5px] text-muted">{p.address[locale]}</span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted">
                          <ClockIcon className="w-[13px]" />
                          {p.hours ?? dict.where.aroundTheClock}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {filtered.length > PREVIEW && (
              <Button className="mt-7 px-7" onClick={() => setExpanded((v) => !v)}>
                {expanded ? dict.where.collapse : dict.where.showAll(filtered.length)}
              </Button>
            )}
          </div>

          <LeafletMap points={filtered} activeId={active} onPick={setActive} />
        </div>
      </Container>
    </section>
  );
}
