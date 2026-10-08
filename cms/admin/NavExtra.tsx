"use client";

import { Link, NavGroup, useConfig } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { extraNavGroups } from "./extraNavGroups";

export function NavExtra() {
  const pathname = usePathname();
  const { config } = useConfig();
  const adminRoute = config.routes.admin;

  return (
    <>
      {extraNavGroups.map((group) => (
        <NavGroup key={group.label} label={group.label}>
          {group.items.map((item) => {
            const href = formatAdminURL({ adminRoute, path: item.path as `/${string}` });
            const active = pathname.startsWith(href) && ["/", undefined].includes(pathname[href.length]);
            const label = (
              <>
                {active && <div className="nav__link-indicator" />}
                <span className="nav__link-label">{item.label}</span>
              </>
            );
            return pathname === href ? (
              <div key={item.path} className="nav__link">
                {label}
              </div>
            ) : (
              <Link key={item.path} href={href} className="nav__link" prefetch={false}>
                {label}
              </Link>
            );
          })}
        </NavGroup>
      ))}
    </>
  );
}
