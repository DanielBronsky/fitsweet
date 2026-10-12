import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { contactHref, contactText, isSocial, type ContactType } from "@/cms/contacts";
import { resolveLink, type ResolvedLink } from "@/cms/fields/link";
import { getCms } from "./cms";
import { getDictionary, type Locale } from "./i18n";
import { navLinks, siteConfig } from "./site";

export type FooterContact = { type: ContactType; value: string; text: string; href: string | null; newTab: boolean };

export type FooterData = {
  background: string;
  divider: string;
  color: string;
  hover: string;
  muted: string;
  fonts: { menu?: string; menuWeight?: string; contacts?: string; contactsWeight?: string; copyright?: string };
  logo: boolean;
  menu: ({ label: string } & ResolvedLink)[];
  contacts: FooterContact[];
  icons: boolean;
  copyright: string;
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

const toContact = (type: ContactType, value: string, text?: string | null): FooterContact => {
  const href = contactHref(type, value);
  return { type, value: value.trim(), text: text?.trim() || contactText(type, value), href, newTab: Boolean(href && /^https?:/.test(href)) };
};

export const getFooterData = cache(async (locale: Locale): Promise<FooterData | null> => {
  const cms = await getCms();
  const [doc, header] = await Promise.all([
    cms.findGlobal({ slug: "footer", depth: 1 }).catch(() => null),
    cms.findGlobal({ slug: "header", depth: 1 }).catch(() => null),
  ]);
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  if (!doc?.updatedAt) {
    return {
      background: "var(--color-cream)",
      divider: "var(--color-green-200)",
      color: "var(--color-green-900)",
      hover: "var(--color-green-700)",
      muted: "var(--color-muted)",
      fonts: {},
      logo: true,
      menu: navLinks.map((l) => ({ label: dict.nav[l.key], href: l.href, newTab: Boolean(l.external) })),
      contacts: [toContact("instagram", siteConfig.instagram), toContact("phone", siteConfig.phone)],
      icons: true,
      copyright: dict.footer.copyright(year, siteConfig.city[locale]),
    };
  }

  const st = doc.style;
  const m = doc.menu;
  const source = m?.mode === "own" ? m.items : header?.menu?.items;
  const menu =
    m?.show === false
      ? []
      : (source ?? []).filter((i) => i.label?.[locale]).map((i) => ({ label: i.label[locale]!, ...resolveLink(i) }));

  return {
    background: css(st?.background, "cream"),
    divider: css(st?.divider, "green-200"),
    color: css(st?.color, "green-900"),
    hover: css(st?.hover, "green-700"),
    muted: css(st?.muted, "muted"),
    fonts: {
      menu: fontToCss(st?.menuFont),
      menuWeight: st?.menuWeight ?? undefined,
      contacts: fontToCss(st?.contactsFont),
      contactsWeight: st?.contactsWeight ?? undefined,
      copyright: fontToCss(st?.copyrightFont),
    },
    logo: doc.logo?.show !== false,
    menu,
    contacts: (doc.contacts?.items ?? [])
      .filter((c) => c.type && c.value)
      .map((c) => toContact(c.type as ContactType, c.value!, c.text?.[locale])),
    icons: doc.contacts?.icons !== false,
    copyright: (doc.bottom?.copyright?.[locale] || dict.footer.copyright(year, siteConfig.city[locale])).replaceAll("{year}", String(year)),
  };
});

export async function getBusinessContacts(locale: Locale) {
  const footer = await getFooterData(locale);
  const contacts = footer?.contacts ?? [];
  return {
    telephone: contacts.find((c) => c.type === "phone")?.value,
    email: contacts.find((c) => c.type === "email")?.value,
    address: contacts.find((c) => c.type === "address")?.text,
    sameAs: contacts.filter((c) => isSocial(c.type) && c.href).map((c) => c.href!),
  };
}
