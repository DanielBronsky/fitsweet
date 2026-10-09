import type { Payload } from "payload";
import { reviews } from "../../lib/reviews-fallback";

export async function seedReviews(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "reviewsSection", depth: 0 });
  if (!doc.updatedAt) {
    await payload.updateGlobal({
      slug: "reviewsSection",
      data: {
        section: { show: true, background: "white" },
        heading: {
          text: { ru: "Что говорят о нас", ro: "Ce spun despre noi" },
          color: "green-900",
          leafColor: "green-500",
          leaf: true,
          subtitleColor: "muted",
        },
        cards: {
          background: "card",
          quoteColor: "green-200",
          textColor: "green-900",
          nameColor: "green-900",
          showProduct: true,
          chipBackground: "sage",
          chipColor: "green-900",
        },
      },
    });
  }

  if ((await payload.count({ collection: "reviews" })).totalDocs > 0) return;
  for (const r of reviews) {
    const { docs } = await payload.find({ collection: "products", where: { slug: { equals: r.productId } }, depth: 0, limit: 1 });
    await payload.create({
      collection: "reviews",
      data: { show: true, author: r.name, text: r.text, product: docs[0]?.id ?? null },
    });
  }
}
