import type { FixedVariant } from "@/cms/media/frames";
import { getSeo, imageFrame } from "./cms";
import { getBusinessContacts } from "./footer";
import { getDictionary, type Locale } from "./i18n";
import { siteConfig } from "./site";
import type { Product } from "./types";

const absolute = (src: string) => (src.startsWith("http") ? src : `${siteConfig.url}${src}`);

export async function getLocalBusinessJsonLd(locale: Locale, products: Product[]) {
  const [seo, contacts] = await Promise.all([getSeo(), getBusinessContacts(locale)]);
  const dict = getDictionary(locale);
  const b = seo?.business;
  const og = imageFrame<FixedVariant>(seo?.ogImage, "og");
  const areas = (b?.areaServed ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const sameAs = [...contacts.sameAs, ...(b?.googleProfile ? [b.googleProfile] : [])];
  const hours = (b?.hours ?? [])
    .filter((h) => h.days?.length && h.opens && h.closes)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days!.map((d) => `https://schema.org/${d}`), opens: h.opens, closes: h.closes }));

  return {
    "@context": "https://schema.org",
    "@type": b?.type || "Bakery",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: seo?.description?.[locale] || dict.meta.description,
    url: `${siteConfig.url}/${locale}`,
    logo: absolute("/site-icon/icon.png"),
    ...(og && { image: absolute(og.src) }),
    ...(contacts.telephone && { telephone: contacts.telephone }),
    ...(contacts.email && { email: contacts.email }),
    address: {
      "@type": "PostalAddress",
      ...((b?.street || contacts.address) && { streetAddress: b?.street || contacts.address }),
      addressLocality: b?.city || siteConfig.city.ro,
      ...(b?.postalCode && { postalCode: b.postalCode }),
      addressCountry: "MD",
    },
    ...(typeof b?.lat === "number" && typeof b?.lng === "number" && { geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng } }),
    ...(hours.length && { openingHoursSpecification: hours }),
    ...(areas.length && { areaServed: areas.map((name) => ({ "@type": "City", name })) }),
    ...(b?.priceRange && { priceRange: b.priceRange }),
    ...(b?.googleProfile && { hasMap: b.googleProfile }),
    ...(sameAs.length && { sameAs }),
    currenciesAccepted: "MDL",
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: p.name[locale], description: `${dict.common.ingredients}: ${p.ingredients[locale]}` },
      price: p.price,
      priceCurrency: "MDL",
    })),
  };
}
