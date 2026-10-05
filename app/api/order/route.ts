import { NextResponse } from "next/server";
import { getDictionary } from "@/lib/i18n";

type OrderItem = { id: string; name: string; qty: number; price: number };
type OrderPayload = {
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  locale?: string;
};

export async function POST(req: Request) {
  let body: OrderPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const dict = getDictionary(body.locale ?? "ru");

  if (!body.name?.trim() || !body.phone?.trim() || !body.address?.trim()) {
    return NextResponse.json(
      { error: `${dict.order.name} / ${dict.order.phone} / ${dict.order.address}` },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: dict.order.emptyCart }, { status: 400 });
  }

  console.log("[FitSweet] Новый заказ:", {
    ...body,
    items: body.items.map((i) => `${i.name} × ${i.qty}`),
  });

  return NextResponse.json({ ok: true });
}
