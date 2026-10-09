"use client";

import { Link, NavGroup, useConfig } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useNavGroups } from "./useNavGroups";

export function NavExtra() {
  const pathname = usePathname();
  const { config } = useConfig();
  const adminRoute = config.routes.admin;
  const groups = useNavGroups();

  const home = (
    <>
      {pathname === adminRoute && <div className="nav__link-indicator" />}
      <span className="nav__link-label">Главная</span>
    </>
  );

  return (
    <>
      {pathname === adminRoute ? (
        <div className="nav__link fs-nav-home">{home}</div>
      ) : (
        <Link href={adminRoute} className="nav__link fs-nav-home" prefetch={false}>
          {home}
        </Link>
      )}
      {groups.map((group) => (
        <NavGroup key={group.label} label={group.label}>
          {group.items.map((item) => {
            const href = formatAdminURL({ adminRoute, path: item.path as `/${string}` });
            const active = pathname.startsWith(href) && ["/", undefined].includes(pathname[href.length]);
            const label = (
              <>
                {active && <div className="nav__link-indicator" />}
                <span className="nav__link-label">{item.sub ? `· ${item.label}` : item.label}</span>
              </>
            );
            return pathname === href ? (
              <div key={item.path} className={`nav__link${item.sub ? " fs-nav-sub" : ""}`}>
                {label}
              </div>
            ) : (
              <Link key={item.path} href={href} className={`nav__link${item.sub ? " fs-nav-sub" : ""}`} prefetch={false}>
                {label}
              </Link>
            );
          })}
        </NavGroup>
      ))}
    </>
  );
}
