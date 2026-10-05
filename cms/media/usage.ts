import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from "payload";
import { collectVariantFiles, sweepOrphanVariants } from "./generate";

const SKIP_COLLECTIONS = new Set(["users", "media", "payload-preferences", "payload-migrations", "payload-locked-documents", "payload-kv"]);

async function eachContentDoc(
  payload: Payload,
  req: PayloadRequest | undefined,
  visit: (target: { global: GlobalSlug } | { collection: CollectionSlug; id: number | string }, doc: unknown) => Promise<void>,
) {
  for (const g of payload.config.globals) {
    const doc = await payload.findGlobal({ slug: g.slug as GlobalSlug, depth: 0, req });
    await visit({ global: g.slug as GlobalSlug }, doc);
  }
  for (const c of payload.config.collections) {
    if (SKIP_COLLECTIONS.has(c.slug)) continue;
    const { docs } = await payload.find({ collection: c.slug as CollectionSlug, depth: 0, limit: 0, pagination: false, req });
    for (const doc of docs) await visit({ collection: c.slug as CollectionSlug, id: doc.id }, doc);
  }
}

function usesMedia(value: unknown, mediaId: number): boolean {
  if (Array.isArray(value)) return value.some((v) => usesMedia(v, mediaId));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("variants" in obj && obj.image === mediaId) return true;
    return Object.values(obj).some((v) => usesMedia(v, mediaId));
  }
  return false;
}

export async function sweepUnusedVariants(payload: Payload, req?: PayloadRequest) {
  const referenced = new Set<string>();
  await eachContentDoc(payload, req, async (_target, doc) => {
    collectVariantFiles(doc, referenced);
  });
  await sweepOrphanVariants(referenced);
}

export async function refreshMediaUsages(payload: Payload, mediaId: number, req?: PayloadRequest) {
  await eachContentDoc(payload, req, async (target, doc) => {
    if (!usesMedia(doc, mediaId)) return;
    const context = { refreshImages: true };
    if ("global" in target) {
      await payload.updateGlobal({ slug: target.global, data: {}, depth: 0, req, context });
    } else {
      await payload.update({ collection: target.collection, id: target.id, data: {}, depth: 0, req, context });
    }
  });
}
