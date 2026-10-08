"use client";

import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { useField } from "@payloadcms/ui";
import type { Map as LeafletMap, Marker } from "leaflet";

const CHISINAU: [number, number] = [47.0245, 28.8322];

type Found = { label: string; lat: number; lng: number };

export function MapPickerField() {
  const lat = useField<number>({ path: "lat" });
  const lng = useField<number>({ path: "lng" });
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const setCoords = useRef<(la: number, ln: number, pan?: boolean) => void>(() => {});
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<Found[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const latValue = lat.value;
  const lngValue = lng.value;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      const maplibre = await import("maplibre-gl");
      maplibre.setWorkerUrl(`/vendor/maplibre-worker?v=${maplibre.getVersion()}`);
      const { maplibreGL } = await import("@maplibre/maplibre-gl-leaflet");
      if (cancelled || !holder.current || map.current) return;

      const start: [number, number] =
        typeof latValue === "number" && typeof lngValue === "number" ? [latValue, lngValue] : CHISINAU;
      const instance = L.map(holder.current, { center: start, zoom: 15, attributionControl: false });
      maplibreGL({ style: "https://tiles.openfreemap.org/styles/positron" }).addTo(instance);
      map.current = instance;

      const icon = L.divIcon({
        className: "",
        html: `<svg viewBox="0 0 24 24" width="38" height="38" fill="none"><path d="M12 22.5s7-6 7-11.4a7 7 0 1 0-14 0c0 5.4 7 11.4 7 11.4Z" fill="#6B7A52" stroke="#fff" stroke-width="1.4"/><circle cx="12" cy="10.6" r="2.6" fill="#fff"/></svg>`,
        iconSize: [38, 38],
        iconAnchor: [19, 36],
      });

      const place = (la: number, ln: number, pan = false) => {
        const roundedLat = Math.round(la * 1e6) / 1e6;
        const roundedLng = Math.round(ln * 1e6) / 1e6;
        lat.setValue(roundedLat);
        lng.setValue(roundedLng);
        if (!marker.current) {
          marker.current = L.marker([la, ln], { icon, draggable: true }).addTo(instance);
          marker.current.on("dragend", () => {
            const p = marker.current!.getLatLng();
            place(p.lat, p.lng);
          });
        } else {
          marker.current.setLatLng([la, ln]);
        }
        if (pan) instance.setView([la, ln], Math.max(instance.getZoom(), 16));
      };
      setCoords.current = place;

      if (typeof latValue === "number" && typeof lngValue === "number") {
        marker.current = L.marker([latValue, lngValue], { icon, draggable: true }).addTo(instance);
        marker.current.on("dragend", () => {
          const p = marker.current!.getLatLng();
          place(p.lat, p.lng);
        });
      }
      instance.on("click", (e) => place(e.latlng.lat, e.latlng.lng));
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError("");
    try {
      const url = `https://photon.komoot.io/api/?limit=6&lat=47.0245&lon=28.8322&q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const json = (await res.json()) as {
        features: {
          geometry: { coordinates: [number, number] };
          properties: { name?: string; street?: string; housenumber?: string; city?: string; county?: string; country?: string };
        }[];
      };
      const results = json.features
        .filter((f) => !f.properties.country || f.properties.country === "Moldova" || f.properties.country === "Молдова")
        .map((f) => {
          const pr = f.properties;
          const street = [pr.street, pr.housenumber].filter(Boolean).join(" ");
          const label = [pr.name, street, pr.city ?? pr.county].filter(Boolean).join(", ");
          return { label, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
        })
        .filter((r, i, all) => all.findIndex((x) => x.label === r.label) === i);
      setFound(results);
      if (results.length === 0) setError("Ничего не найдено. Попробуйте иначе или кликните по карте.");
      if (results.length > 0) setCoords.current(results[0].lat, results[0].lng, true);
    } catch {
      setError("Поиск сейчас недоступен — поставьте метку кликом по карте.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="field-type" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          placeholder="Адрес или название: Ștefan cel Mare 132 · Linella Independenței"
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 6,
            background: "var(--theme-input-bg)",
            color: "inherit",
          }}
        />
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} onClick={search} disabled={searching}>
          {searching ? "Ищу…" : "Найти"}
        </button>
      </div>

      {found.length > 1 && (
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--theme-elevation-500)" }}>Метка стоит на первом варианте. Если не то — выберите другой:</p>
      )}
      {found.length > 1 && (
        <ul style={{ listStyle: "none", margin: "0 0 8px", padding: 0, border: "1px solid var(--theme-elevation-150)", borderRadius: 6 }}>
          {found.map((f) => (
            <li key={`${f.lat},${f.lng}`}>
              <button
                type="button"
                onClick={() => {
                  setCoords.current(f.lat, f.lng, true);
                  setFound([]);
                }}
                style={{ all: "unset", display: "block", width: "100%", boxSizing: "border-box", padding: "8px 12px", fontSize: 13, cursor: "pointer" }}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--theme-warning-500)" }}>{error}</p>}

      <div ref={holder} style={{ height: 340, borderRadius: 8, overflow: "hidden", border: "1px solid var(--theme-elevation-150)" }} />
      <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--theme-elevation-500)" }}>
        Улицы на карте подписаны по-румынски — так поиск находит точнее. Кликните по карте или перетащите метку, чтобы поставить точно.
      </p>
    </div>
  );
}
