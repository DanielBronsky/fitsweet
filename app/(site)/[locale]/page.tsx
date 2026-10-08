import { Fragment, type ReactNode } from "react";
import { getSectionOrder } from "@/lib/layout";
import type { SectionKey } from "@/cms/sections";
import { getDictionary, type Locale } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { getHeroData } from "@/lib/hero";
import { Catalog } from "@/components/sections/Catalog";
import { Moods } from "@/components/sections/Moods";
import { WhereToBuy } from "@/components/sections/WhereToBuy";
import { Delivery } from "@/components/sections/Delivery";
import { BoxBuilder } from "@/components/sections/BoxBuilder";
import { Reviews } from "@/components/sections/Reviews";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { OrderForm } from "@/components/sections/OrderForm";
import { FinalCta } from "@/components/sections/FinalCta";
import { getCatalogData, getMoodsData, getProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(locale);
  const products = await getProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    description: dict.meta.description,
    url: `${siteConfig.url}/${l}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city[l],
      addressCountry: "MD",
    },
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: p.name[l],
        description: `${dict.common.ingredients}: ${p.ingredients[l]}`,
      },
      price: p.price,
      priceCurrency: "MDL",
    })),
  };

  const order = await getSectionOrder();
  const sections: Record<SectionKey, ReactNode> = {
    hero: <Hero data={await getHeroData(l)} />,
    catalog: <Catalog data={await getCatalogData(l)} />,
    moods: <Moods data={await getMoodsData(l)} />,
    where: <WhereToBuy />,
    delivery: <Delivery />,
    box: <BoxBuilder />,
    reviews: <Reviews />,
    instagram: <InstagramFeed />,
    order: <OrderForm />,
    finalCta: <FinalCta />,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {order.map((key) => (
        <Fragment key={key}>{sections[key]}</Fragment>
      ))}
    </>
  );
}
