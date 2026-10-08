"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import type { HeroData } from "@/lib/hero";

export function HeroHeading({ heading }: { heading: HeroData["heading"] }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.setProperty("--hero-fit", "1");
      const widest = Math.max(...Array.from(el.children).map((c) => (c as HTMLElement).scrollWidth));
      const available = el.clientWidth;
      const tolerance = parseFloat(getComputedStyle(el).fontSize) * 0.15;
      if (available > 0 && widest > available + tolerance) {
        el.style.setProperty("--hero-fit", String(Math.max(0.5, available / widest)));
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [heading]);

  const style = {
    "--hero-scale": heading.scale,
    "--hero-fit": 1,
    fontFamily: heading.font,
    fontWeight: heading.weight,
  } as CSSProperties;

  return (
    <h1
      ref={ref}
      style={style}
      className="heading-caps leading-[1.1] text-[calc(32px*var(--hero-scale)*var(--hero-fit))] sm:text-[calc(42px*var(--hero-scale)*var(--hero-fit))] lg:text-[calc(46px*var(--hero-scale)*var(--hero-fit))] xl:text-[calc(50px*var(--hero-scale)*var(--hero-fit))]"
    >
      {heading.lines.map((line, i) => (
        <span key={i} style={{ color: line.color }} className="block sm:whitespace-nowrap">
          {line.text}
        </span>
      ))}
    </h1>
  );
}
