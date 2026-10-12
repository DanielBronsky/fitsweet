import type { CSSProperties } from "react";
import type { FooterData } from "@/lib/footer";
import type { HeaderData } from "@/lib/header";
import { Container } from "@/components/ui/Container";
import { ContactIcon } from "@/components/ui/ContactIcon";
import { HeaderLogo } from "./HeaderLogo";

const external = (newTab: boolean) => (newTab ? { target: "_blank", rel: "noopener noreferrer" } : {});

export function Footer({ data, header, navLabel }: { data: FooterData | null; header: Pick<HeaderData, "logo" | "tagline">; navLabel: string }) {
  if (!data) return null;
  const vars = { "--ft-color": data.color, "--ft-hover": data.hover } as CSSProperties;
  const showLogo = data.logo && (header.logo || header.tagline);

  return (
    <footer style={{ background: data.background, ...vars }} className="py-9">
      <Container>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          {showLogo ? <HeaderLogo logo={header.logo} tagline={header.tagline} /> : <span />}

          {data.menu.length > 0 && (
            <nav aria-label={navLabel} className="flex max-w-[560px] flex-wrap justify-center gap-x-6 gap-y-2.5">
              {data.menu.map((l, i) => (
                <a
                  key={`${l.href}-${i}`}
                  href={l.href}
                  {...external(l.newTab)}
                  style={{ fontFamily: data.fonts.menu, fontWeight: data.fonts.menuWeight }}
                  className="text-[12.5px] text-[var(--ft-color)] opacity-80 transition-[color,opacity] hover:text-[var(--ft-hover)] hover:opacity-100"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          {data.contacts.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 md:flex-col md:flex-nowrap md:items-start md:gap-y-2">
              {data.contacts.map((c, i) => {
                const body = (
                  <>
                    {data.icons && <ContactIcon type={c.type} className="w-[15px] shrink-0" />}
                    {c.text}
                  </>
                );
                const cls = "inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ft-color)] transition-colors";
                return (
                  <li key={`${c.type}-${i}`} style={{ fontFamily: data.fonts.contacts, fontWeight: data.fonts.contactsWeight }}>
                    {c.href ? (
                      <a href={c.href} {...external(c.newTab)} className={`${cls} hover:text-[var(--ft-hover)]`}>
                        {body}
                      </a>
                    ) : (
                      <span className={cls}>{body}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p
          style={{ borderColor: `color-mix(in srgb, ${data.divider} 50%, transparent)`, color: data.muted, fontFamily: data.fonts.copyright }}
          className="mt-6 border-t pt-5 text-center text-[11px]"
        >
          {data.copyright}
        </p>
      </Container>
    </footer>
  );
}
