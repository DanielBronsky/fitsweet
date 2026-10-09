"use client";

import { useEffect, useState } from "react";
import { TextField, useConfig, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { parseInstagramUrl } from "../instagram-url";

type Preview = {
  code: string;
  kind?: "post" | "reel";
  mediaId?: number;
  thumb?: string;
  width?: number;
  height?: number;
  kept?: boolean;
  own?: boolean;
  error?: string;
};

export const InstagramUrlField: TextFieldClientComponent = (props) => {
  const { config } = useConfig();
  const { value } = useField<string>({ path: props.path });
  const kind = useField<string>({ path: props.path.replace(/url$/, "kind") });
  const cover = useField<number | { id: number } | null>({ path: props.path.replace(/url$/, "cover.image") });
  const crops = useField<unknown>({ path: props.path.replace(/url$/, "cover.crops") });
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);

  const parsed = parseInstagramUrl(value);
  const code = parsed?.code ?? null;
  const setKind = kind.setValue;
  const setCover = cover.setValue;
  const setCrops = crops.setValue;
  const coverValue = cover.value;
  const currentCover = coverValue && typeof coverValue === "object" ? coverValue.id : (coverValue ?? null);

  useEffect(() => {
    if (!code) return;
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.serverURL}${config.routes.api}/instagramPosts/import-cover`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value, current: currentCover }),
        });
        const data = (await res.json()) as Preview;
        if (!alive) return;
        setPreview(data);
        if (data.kind) setKind(data.kind);
        if (data.mediaId && data.mediaId !== currentCover) {
          setCover(data.mediaId);
          setCrops(null);
        }
      } catch {
        if (alive) setPreview({ code, error: "network" });
      } finally {
        if (alive) setLoading(false);
      }
    }, 500);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const current = preview && preview.code === code ? preview : null;
  const muted = { fontSize: 13, color: "var(--theme-elevation-500)" };

  return (
    <div>
      <TextField {...props} />
      {value && !code && <p style={{ ...muted, margin: "-8px 0 16px" }}>Это не похоже на ссылку на пост Instagram.</p>}
      {code && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "-4px 0 20px",
            padding: 12,
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 8,
            minHeight: 96,
          }}
        >
          {loading && !current && <span style={muted}>Загружаю обложку из Instagram…</span>}
          {current && !current.error && (
            <>
              {current.thumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.thumb} alt="" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 6 }} />
              )}
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{current.kind === "reel" ? "▶ Видео" : "Фото"}</div>
                <div style={{ ...muted, marginTop: 4 }}>
                  {current.own
                    ? "Обложка — ваша картинка, её не меняю."
                    : current.kept
                      ? `Обложка ${current.width}×${current.height} — ниже можно поправить обрезку.`
                      : `Обложка ${current.width}×${current.height} подставлена ниже — можно сразу поправить обрезку и сохранить.`}
                </div>
              </div>
            </>
          )}
          {current?.error && !loading && (
            <span style={{ fontSize: 13, color: "var(--theme-warning-500)" }}>
              Instagram не показал этот пост. Проверьте ссылку или загрузите обложку вручную ниже.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
