import fs from "fs/promises";
import path from "path";
import { VARIANTS_DIR } from "@/cms/media/generate";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
};

// Только имена, которые генерирует cms/media/generate.ts — без путей и точек
const SAFE_NAME = /^[a-z0-9-]+\.(webp|jpg)$/;

/**
 * Отдаёт нарезанные картинки из медиатеки.
 * В имени файла — хэш рамки, поэтому кэшируем навсегда.
 * На VPS эту папку лучше отдавать напрямую через nginx — маршрут остаётся запасным.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!SAFE_NAME.test(file)) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(path.join(VARIANTS_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(file)],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
