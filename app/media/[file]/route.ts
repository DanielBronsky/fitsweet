import fs from "fs/promises";
import path from "path";
import { VARIANTS_DIR } from "@/cms/media/generate";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const SAFE_NAME = /^[a-z0-9-]+\.(webp|jpg|svg)$/;

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!SAFE_NAME.test(file)) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(path.join(VARIANTS_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(file)],
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
