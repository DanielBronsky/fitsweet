import type { Payload } from "payload";

export async function seedInstagram(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "instagramSection", depth: 0 });
  if (doc.updatedAt) return;
  await payload.updateGlobal({
    slug: "instagramSection",
    data: {
      section: { show: true, background: "cream" },
      heading: {
        text: { ru: "Больше FitSweet каждый день", ro: "Mai mult FitSweet în fiecare zi" },
        color: "green-900",
        leafColor: "green-500",
        leaf: true,
      },
      posts: { count: 5, open: "modal", overlay: "green-900" },
      profile: {
        handle: "fitsweet.md",
        followUs: { ru: "Следите за нами в Instagram", ro: "Urmărește-ne pe Instagram" },
        description: {
          ru: "Рецепты, новинки, акции и много вкусного контента.",
          ro: "Rețete, noutăți, promoții și mult conținut delicios.",
        },
        titleColor: "green-900",
        textColor: "muted",
        cta: { ru: "Перейти в Instagram", ro: "Mergi pe Instagram" },
        buttonBackground: "green-700",
        buttonColor: "cream",
      },
    },
  });
}

export async function refreshInstagramCovers(payload: Payload) {
  const { docs } = await payload.find({ collection: "instagramPosts", depth: 0, limit: 0, pagination: false });
  for (const post of docs) {
    const frame = (post.cover?.variants as { frames?: { desktop?: { width: number; height: number } } } | null)?.frames?.desktop;
    if (!frame || Math.abs(frame.width / frame.height - 4 / 5) < 0.01) continue;
    await payload.update({ collection: "instagramPosts", id: post.id, data: {}, context: { refreshImages: true } });
  }
}
