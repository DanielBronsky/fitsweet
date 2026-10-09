import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import { VARIANTS_DIR, type IconVariants } from "@/cms/media/generate";
import { getSeo } from "./cms";

export type IconKind = "favicon.ico" | "icon.png" | "apple-icon.png";

const variantKey: Record<IconKind, keyof Pick<IconVariants, "ico" | "icon" | "apple">> = {
  "favicon.ico": "ico",
  "icon.png": "icon",
  "apple-icon.png": "apple",
};

export const getIconVariants = cache(async (): Promise<IconVariants | null> => {
  const seo = await getSeo();
  const variants = (seo?.favicon as { variants?: IconVariants | null } | null | undefined)?.variants;
  return variants?.icon ? variants : null;
});

export async function readSiteIcon(kind: IconKind): Promise<Buffer | null> {
  const custom = await getIconVariants();
  if (custom) {
    const file = path.basename(custom[variantKey[kind]]);
    const data = await fs.readFile(path.join(VARIANTS_DIR, file)).catch(() => null);
    if (data) return data;
  }
  return fs.readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "brand", kind)).catch(() => null);
}

export async function siteIconVersion(): Promise<string> {
  const custom = await getIconVariants();
  return custom ? path.basename(custom.icon).replace(/-512\.png$/, "") : "default";
}

const TYPES: Record<IconKind, string> = {
  "favicon.ico": "image/x-icon",
  "icon.png": "image/png",
  "apple-icon.png": "image/png",
};

export const isIconKind = (value: string): value is IconKind => value in TYPES;

export async function serveSiteIcon(kind: IconKind, versioned: boolean) {
  const data = await readSiteIcon(kind);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": TYPES[kind],
      "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
