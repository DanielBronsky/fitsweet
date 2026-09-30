import { revalidatePath } from "next/cache";

/**
 * После сохранения в админке пересобираем статические страницы сайта.
 * Вне запроса Next (CLI payload, миграции, сиды) revalidatePath бросает —
 * там пересборка не нужна, просто пропускаем.
 */
export function revalidateSite() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
  } catch {
    // не в контексте Next.js
  }
}

export const revalidateAfterChange = () => {
  revalidateSite();
};
