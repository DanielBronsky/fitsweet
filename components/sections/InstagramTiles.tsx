"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { InstagramData, InstagramTile } from "@/lib/instagram-feed";
import { useI18n } from "@/lib/i18n/context";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";
import { ArrowIcon, CloseIcon, InstagramIcon } from "@/components/ui/Icons";

const PlayIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />
  </svg>
);

const GAP = 16;

export function InstagramTiles({
  tiles,
  open,
  overlay,
  profile,
  children,
}: {
  tiles: InstagramTile[];
  open: InstagramData["open"];
  overlay: string;
  profile: InstagramData["profile"];
  children: ReactNode;
}) {
  const { dict } = useI18n();
  const [active, setActive] = useState<InstagramTile | null>(null);
  const strip = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false });
  const slider = tiles.length > 5;

  const measure = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    setEdges({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, tiles.length]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const scroll = (dir: 1 | -1) => strip.current?.scrollBy({ left: dir * (strip.current.clientWidth + GAP), behavior: "smooth" });

  const cols = tiles.length >= 5 ? "lg:grid-cols-5" : tiles.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const arrow =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-green-200 bg-white text-green-900 transition-[opacity,border-color] duration-200 hover:border-green-700 disabled:pointer-events-none disabled:opacity-35";

  const handle = (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: profile.titleColor }}
      className="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium hover:underline hover:underline-offset-4"
    >
      <InstagramIcon className="w-[18px]" />@{profile.handle}
    </a>
  );

  const button = (className: string) => (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ background: profile.buttonBackground, color: profile.buttonColor }}
      className={`inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[14px] font-medium transition-[filter] duration-200 hover:brightness-95 ${className}`}
    >
      {profile.cta}
    </a>
  );

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">{children}</div>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          {handle}
          {button("")}
          {slider && (
            <div className="ml-1 flex gap-2">
              <button type="button" onClick={() => scroll(-1)} disabled={!edges.prev} aria-label={dict.instagram.prev} className={arrow}>
                <ArrowIcon className="w-5 rotate-180" />
              </button>
              <button type="button" onClick={() => scroll(1)} disabled={!edges.next} aria-label={dict.instagram.next} className={arrow}>
                <ArrowIcon className="w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {tiles.length > 0 && (
        <ul
          ref={strip}
          onScroll={slider ? measure : undefined}
          style={{ "--ig-overlay": overlay } as CSSProperties}
          className={`scroll-snap-x -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 scroll-px-5 pb-2 sm:mx-0 sm:gap-4 sm:px-0 sm:scroll-px-0 sm:pb-0 lg:mt-10 ${
            slider ? "" : `lg:grid lg:overflow-visible ${cols}`
          }`}
        >
          {tiles.map((t) => (
            <li
              key={t.id}
              className={`snap-item w-[62%] shrink-0 sm:w-[calc((100%-32px)/3)] ${slider ? "lg:w-[calc((100%-64px)/5)]" : "lg:w-auto"}`}
            >
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (open !== "modal" || !t.code) return;
                  e.preventDefault();
                  setActive(t);
                }}
                aria-label={t.kind === "reel" ? dict.instagram.openVideo : dict.instagram.openPost}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-card"
              >
                {t.picture ? (
                  <ResponsivePicture
                    data={t.picture}
                    sizesDesktop="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 240px"
                    sizesMobile="62vw"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  t.staticSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.staticSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  )
                )}
                {t.kind === "reel" && (
                  <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                    <PlayIcon className="w-4" />
                  </span>
                )}
                <span className="absolute inset-0 grid place-items-center bg-[color-mix(in_srgb,var(--ig-overlay)_0%,transparent)] text-cream opacity-0 transition-all duration-300 group-hover:bg-[color-mix(in_srgb,var(--ig-overlay)_30%,transparent)] group-hover:opacity-100">
                  {t.kind === "reel" ? <PlayIcon className="w-10" /> : <InstagramIcon className="w-8" />}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col items-center gap-4 sm:hidden">
        {handle}
        {button("w-full")}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label={dict.instagram.close}
              className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-green-900 hover:bg-white"
            >
              <CloseIcon className="w-5" />
            </button>
            <div className="h-[min(82vh,720px)] overflow-hidden rounded-card bg-white">
              <iframe
                src={`https://www.instagram.com/p/${active.code}/embed/`}
                title="Instagram"
                className="h-full w-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                allowFullScreen
              />
            </div>
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 text-[13px] text-white/90 underline underline-offset-4 hover:text-white"
            >
              <InstagramIcon className="w-4" />
              {dict.instagram.openInInstagram}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
