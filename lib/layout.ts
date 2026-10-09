import { cache } from "react";
import { normalizeLayout, type LayoutEntry } from "@/cms/sections";
import { getCms } from "./cms";

export const getLayout = cache(async (): Promise<LayoutEntry[]> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "layout", depth: 0 });
    return normalizeLayout(doc.blocks ?? []);
  } catch (err) {
    console.error("[cms] не удалось загрузить порядок блоков:", err);
    return normalizeLayout([]);
  }
});
