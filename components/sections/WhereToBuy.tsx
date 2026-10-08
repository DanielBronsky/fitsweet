"use client";

import { useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n/context";
import type { WhereData } from "@/lib/where";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ClockIcon, PinIcon } from "@/components/ui/Icons";

const LeafletMap = dynamic(() => import("@/components/ui/LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="aspect-[4/3] w-full animate-pulse rounded-card bg-sage lg:aspect-auto lg:h-full lg:min-h-[420px]" />
  ),
});

export function WhereToBuy({ data }: { data: WhereData | null }) {
  const { locale } = useI18n();
  const [cat, setCat] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  if (!data) return null;
  const { style, more } = data;

  const filtered = cat === "all" ? data.points : data.points.filter((p) => p.category === cat);
  const visible = expanded ? filtered : filtered.slice(0, more.initialCount);

  const vars = {
    "--chip-active": style.chipActive,
    "--chip-border": style.chipBorder,
    "--card-active": style.cardActive,
  } as CSSProperties;

  const chips = [{ key: "all", label: data.allLabel }, ...data.categories];

  return (
    <section id="where" style={{ background: data.background, ...vars }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle align="left" data={data.title} />

        <div className={`mt-8 grid gap-8 lg:gap-10 ${data.showMap ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]" : ""}`}>
          <div>
            {data.subtitle && (
              <p style={{ color: data.subtitle.color }} className="max-w-[430px] text-[15px] leading-relaxed">
                {data.subtitle.text}
              </p>
            )}

            {data.categories.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((c) => {
                  const on = cat === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setCat(c.key);
                        setExpanded(false);
                        setActive(null);
                      }}
                      className={`inline-flex h-10 items-center whitespace-nowrap rounded-full border px-5 text-[13px] font-medium transition-colors duration-200 ${
                        on
                          ? "border-[var(--chip-active)] bg-[var(--chip-active)] text-cream"
                          : "border-[var(--chip-border)] bg-transparent text-green-900 hover:border-[var(--chip-active)]"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            )}

            {filtered.length === 0 ? (
              <p style={{ background: style.cardBackground, color: style.infoColor }} className="mt-8 rounded-card px-5 py-6 text-[14px]">
                {data.empty}
              </p>
            ) : (
              <ul className={`mt-7 grid gap-3 sm:grid-cols-2 ${data.showMap ? "" : "lg:grid-cols-4"}`}>
                {visible.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(p.id)}
                      onFocus={() => setActive(p.id)}
                      onClick={() => setActive(p.id)}
                      style={{ background: style.cardBackground }}
                      className={`flex w-full items-start gap-3 rounded-tile border px-4 py-3.5 text-left transition-colors duration-200 ${
                        active === p.id ? "border-[var(--card-active)]" : "border-transparent hover:border-[var(--chip-border)]"
                      }`}
                    >
                      <PinIcon className="mt-0.5 w-[18px] shrink-0" style={{ color: style.pinColor }} />
                      <span className="min-w-0">
                        <span style={{ color: style.nameColor, fontFamily: style.nameFont }} className="block text-[14px] font-semibold">
                          {p.name}
                        </span>
                        <span style={{ color: style.infoColor }} className="mt-0.5 block text-[12.5px]">
                          {p.address[locale]}
                        </span>
                        {p.hours && (
                          <span style={{ color: style.infoColor }} className="mt-1.5 flex items-center gap-1.5 text-[12px]">
                            <ClockIcon className="w-[13px]" />
                            {p.hours}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {filtered.length > more.initialCount && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                style={{ background: more.background, color: more.color }}
                className="mt-7 inline-flex h-10 items-center justify-center rounded-full px-7 text-[13px] font-medium transition-[filter] duration-200 hover:brightness-95"
              >
                {expanded ? more.collapse : more.showAll.replace("{n}", String(filtered.length))}
              </button>
            )}
          </div>

          {data.showMap && <LeafletMap points={filtered} activeId={active} onPick={setActive} pinColor={style.pinColor} />}
        </div>
      </Container>
    </section>
  );
}
