"use client";

import { useEffect } from "react";

const clearHash = () => {
  if (window.location.hash) history.replaceState(history.state, "", window.location.pathname + window.location.search);
};

export function AnchorScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.target === "_blank") return;
      const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
      const target = id ? document.getElementById(id) : null;
      e.preventDefault();
      if (target) {
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      } else if (!id) {
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }
      clearHash();
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
      timer = setTimeout(clearHash, 600);
    }

    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
