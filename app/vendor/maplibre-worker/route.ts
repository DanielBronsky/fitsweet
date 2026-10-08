import fs from "fs/promises";
import path from "path";

let cached: Buffer | null = null;

export async function GET() {
  cached ??= await fs.readFile(path.join(process.cwd(), "node_modules", "maplibre-gl", "dist", "maplibre-gl-worker.mjs"));
  return new Response(new Uint8Array(cached), {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
