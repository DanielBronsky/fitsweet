import { getDictionary, type Locale } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { Catalog } from "@/components/sections/Catalog";
import { Moods } from "@/components/sections/Moods";
import { WhereToBuy } from "@/components/sections/WhereToBuy";
import { Delivery } from "@/components/sections/Delivery";
import { BoxBuilder } from "@/components/sections/BoxBuilder";
import { Reviews } from "@/components/sections/Reviews";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { OrderForm } from "@/components/sections/OrderForm";
import { FinalCta } from "@/components/sections/FinalCta";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(locale);

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Catalog />
      <Moods />
      <WhereToBuy />
      <Delivery />
      <BoxBuilder />
      <Reviews />
      <InstagramFeed />
      <OrderForm />
      <FinalCta />
    </>
  );
}
