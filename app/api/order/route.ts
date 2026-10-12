import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/orders";

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (tooMany(ip)) return NextResponse.json({ error: "rate" }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid" }, { status: 400 });

  try {
    const result = await placeOrder(body);
    if (!result.ok) {
      if (result.error === "spam") return NextResponse.json({ ok: true, number: 0 });
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, number: result.number });
  } catch (err) {
    console.error("[order] не удалось сохранить заказ:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
