"use client";

import { Card, Link, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useNavGroups } from "./useNavGroups";

export function DashboardExtra() {
  const { config } = useConfig();
  const adminRoute = config.routes.admin;
  const groups = useNavGroups();

  return (
    <div className="fs-dash">
      {groups.map((group) => (
        <div key={group.label} className="fs-dash__group">
          <h2 className="fs-dash__label">{group.label}</h2>
          <ul className="fs-dash__cards">
            {group.items.map((item) => (
              <li key={item.path}>
                <Card
                  title={item.sub ? `↳ ${item.label}` : item.label}
                  href={formatAdminURL({ adminRoute, path: item.path as `/${string}` })}
                  Link={Link}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
