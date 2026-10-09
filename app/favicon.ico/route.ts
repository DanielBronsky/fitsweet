import { serveSiteIcon } from "@/lib/site-icon";

export const dynamic = "force-dynamic";

export function GET() {
  return serveSiteIcon("favicon.ico", false);
}
