"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMapType, Marker } from "leaflet";
import type { SalePoint } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

const CHISINAU: [number, number] = [47.0245, 28.8322];

export function LeafletMap({
  points,
  activeId,
  onPick,
}: {
  points: SalePoint[];
  activeId?: string | null;
  onPick?: (id: string) => void;
}) {
  const { locale, dict } = useI18n();
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMapType | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());
  const onPickRef = useRef(onPick);
  const [hintVisible, setHintVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    if (!holder.current || map.current) return;
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const registry = markers.current;

    (async () => {
      const L = (await import("leaflet")).default;
      const maplibre = await import("maplibre-gl");
      maplibre.setWorkerUrl(`/vendor/maplibre-worker?v=${maplibre.getVersion()}`);
      const { maplibreGL } = await import("@maplibre/maplibre-gl-leaflet");
      if (cancelled || !holder.current || map.current) return;

      const el = holder.current;

      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      const instance = L.map(el, {
        center: CHISINAU,
        zoom: 13,
        scrollWheelZoom: false,
        touchZoom: true,
        dragging: !coarsePointer,
        attributionControl: true,
      });
      instance.attributionControl.setPrefix(false);
      map.current = instance;

      maplibreGL({ style: "https://tiles.openfreemap.org/styles/positron" }).addTo(instance);
      setReady(true);

      const enableWheel = () => instance.scrollWheelZoom.enable();
      const disableWheel = () => instance.scrollWheelZoom.disable();
      el.addEventListener("mouseenter", enableWheel);
      el.addEventListener("mouseleave", disableWheel);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", enableWheel);
        el.removeEventListener("mouseleave", disableWheel);
      });

      if (coarsePointer) {
        let hideTimer: ReturnType<typeof setTimeout> | undefined;

        const hide = () => {
          clearTimeout(hideTimer);
          setHintVisible(false);
        };

        const onTouchMove = (e: TouchEvent) => {
          if (e.touches.length !== 1) {
            hide();
            return;
          }
          clearTimeout(hideTimer);
          setHintVisible(true);
          hideTimer = setTimeout(() => setHintVisible(false), 2200);
        };

        el.addEventListener("touchmove", onTouchMove, { passive: true });
        el.addEventListener("touchend", hide);
        cleanups.push(() => {
          clearTimeout(hideTimer);
          el.removeEventListener("touchmove", onTouchMove);
          el.removeEventListener("touchend", hide);
        });
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      map.current?.remove();
      map.current = null;
      registry.clear();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ready || !map.current) return;

      markers.current.forEach((m) => m.remove());
      markers.current.clear();

      for (const p of points) {
        const icon = L.divIcon({
          className: "fitsweet-pin",
          html: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none">
            <path d="M12 22.5s7-6 7-11.4a7 7 0 1 0-14 0c0 5.4 7 11.4 7 11.4Z"
                  fill="#6B7A52" stroke="#FAF8F3" stroke-width="1.4" stroke-linejoin="round"/>
            <circle cx="12" cy="10.6" r="2.6" fill="#FAF8F3"/>
          </svg>`,
          iconSize: [34, 34],
          iconAnchor: [17, 32],
          popupAnchor: [0, -30],
        });

        const marker = L.marker(p.coords, { icon, title: p.name })
          .addTo(map.current)
          .bindPopup(
            `<strong style="font-size:13px">${p.name}</strong><br/>
             <span style="font-size:12px;color:#7C7A70">${p.address[locale]}<br/>${
               p.hours ?? dict.where.aroundTheClock
             }</span>`,
          )
          .on("click", () => onPickRef.current?.(p.id));

        markers.current.set(p.id, marker);
      }

      if (points.length > 0) {
        map.current.fitBounds(
          L.latLngBounds(points.map((p) => p.coords)),
          { padding: [46, 46], maxZoom: 14 },
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [points, locale, dict.where.aroundTheClock, ready]);

  useEffect(() => {
    if (!activeId || !map.current) return;
    const marker = markers.current.get(activeId);
    if (!marker) return;
    map.current.panTo(marker.getLatLng(), { animate: true });
    marker.openPopup();
  }, [activeId]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-sage lg:aspect-auto lg:h-full lg:min-h-[420px]">
      <div
        ref={holder}
        role="application"
        aria-label={dict.where.mapLabel}
        className="absolute inset-0 z-0"
      />

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-green-900/40 px-6 text-center transition-opacity duration-200 ${
          hintVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="rounded-tile bg-cream px-4 py-2.5 text-[13px] font-medium leading-snug text-green-900 shadow-sm">
          {dict.where.mapHint}
        </span>
      </div>
    </div>
  );
}
