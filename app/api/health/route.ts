import fs from "fs/promises";
import { getCms } from "@/lib/cms";
import { MEDIA_DIR } from "@/cms/media/generate";
import { botToken, hasAdminBot } from "@/cms/telegram/api";
import { adminBotIsPolling, adminBotLastPollAt, botIsPolling, botLastPollAt } from "@/cms/telegram/bot";

export const dynamic = "force-dynamic";

async function check<T>(fn: () => Promise<T>) {
  const started = Date.now();
  try {
    const value = await fn();
    return { ok: true as const, ms: Date.now() - started, value };
  } catch (err) {
    return { ok: false as const, ms: Date.now() - started, error: (err as Error).message.slice(0, 200) };
  }
}

export async function GET() {
  const db = await check(async () => (await getCms()).count({ collection: "products", overrideAccess: true }).then((r) => r.totalDocs));
  const media = await check(async () => {
    await fs.access(MEDIA_DIR, fs.constants.W_OK);
    const stat = await fs.statfs(MEDIA_DIR);
    return { usedPct: Math.round((1 - stat.bavail / stat.blocks) * 100) };
  });
  const polling = process.env.TELEGRAM_POLLING !== "false" && Boolean(botToken());
  const status = (running: boolean, last: number) => ({
    ok: running && Date.now() - last < 3 * 60 * 1000,
    lastPollSecondsAgo: last ? Math.round((Date.now() - last) / 1000) : null,
  });
  const orders = status(botIsPolling(), botLastPollAt());
  const admin = hasAdminBot() ? status(adminBotIsPolling(), adminBotLastPollAt()) : null;
  const bot = polling ? { enabled: true, ok: orders.ok && (admin?.ok ?? true), orders, admin } : { enabled: false, ok: true };

  const ok = db.ok && media.ok;
  return Response.json(
    { ok, db, media, bot, uptimeSeconds: Math.round(process.uptime()) },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
