import { isIconKind, serveSiteIcon } from "@/lib/site-icon";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!isIconKind(file)) return new Response("Not found", { status: 404 });
  return serveSiteIcon(file, new URL(req.url).searchParams.has("v"));
}
