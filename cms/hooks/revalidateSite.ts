import { revalidatePath } from "next/cache";
import type { PayloadRequest } from "payload";
import { sweepUnusedVariants } from "../media/usage";

export function revalidateSite() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
  } catch {}
}

export const afterContentChange = async ({ req }: { req: PayloadRequest }) => {
  if (!req.context.refreshImages) await sweepUnusedVariants(req.payload, req);
  revalidateSite();
};
