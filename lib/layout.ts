import { cache } from "react";
import { defaultSectionOrder, normalizeOrder, type SectionKey } from "@/cms/sections";
import { getCms } from "./cms";

export const getSectionOrder = cache(async (): Promise<SectionKey[]> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "layout", depth: 0 });
    return normalizeOrder((doc.blocks ?? []).map((b) => b.block));
  } catch (err) {
    console.error("[cms] не удалось загрузить порядок блоков:", err);
    return defaultSectionOrder;
  }
});
