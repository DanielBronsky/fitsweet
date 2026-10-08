"use client";

import { Card, Link, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { extraNavGroups } from "./extraNavGroups";

export function DashboardExtra() {
  const { config } = useConfig();
  const adminRoute = config.routes.admin;

  return (
    <div className="fs-dash">
      {extraNavGroups.map((group) => (
        <div key={group.label} className="fs-dash__group">
          <h2 className="fs-dash__label">{group.label}</h2>
          <ul className="fs-dash__cards">
            {group.items.map((item) => (
              <li key={item.path}>
                <Card
                  title={item.label}
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
