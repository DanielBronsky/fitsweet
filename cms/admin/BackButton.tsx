"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useConfig } from "@payloadcms/ui";

let visited = 0;
let lastPath: string | null = null;

function parentOf(pathname: string, adminRoute: string) {
  const rest = pathname.slice(adminRoute.length).split("/").filter(Boolean);
  if (rest[0] === "collections" && rest.length > 2) return `${adminRoute}/collections/${rest[1]}`;
  return adminRoute;
}

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useConfig();
  const adminRoute = config.routes.admin;

  useEffect(() => {
    if (pathname !== lastPath) {
      lastPath = pathname;
      visited += 1;
    }
  }, [pathname]);

  if (pathname === adminRoute || pathname === `${adminRoute}/`) return null;

  const goBack = () => {
    if (visited > 1) router.back();
    else router.push(parentOf(pathname, adminRoute));
  };

  return (
    <button type="button" onClick={goBack} className="fs-back" aria-label="Назад">
      <span aria-hidden>←</span> Назад
    </button>
  );
}
