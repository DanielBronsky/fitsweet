import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ru } from "@payloadcms/translations/languages/ru";
import sharp from "sharp";

import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { Products } from "./cms/collections/Products";
import { Moods } from "./cms/collections/Moods";
import { SalePoints } from "./cms/collections/SalePoints";
import { PointCategories } from "./cms/collections/PointCategories";
import { ProductCategories } from "./cms/collections/ProductCategories";
import { CustomSections } from "./cms/collections/CustomSections";
import { Theme } from "./cms/globals/Theme";
import { Seo } from "./cms/globals/Seo";
import { Header } from "./cms/globals/Header";
import { Hero } from "./cms/globals/Hero";
import { Catalog } from "./cms/globals/Catalog";
import { Layout } from "./cms/globals/Layout";
import { MoodsSection } from "./cms/globals/MoodsSection";
import { WhereSection } from "./cms/globals/WhereSection";
import { DeliverySection } from "./cms/globals/DeliverySection";
import { Typography } from "./cms/globals/Typography";
import { ruOverrides } from "./cms/i18n-ru";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    components: {
      afterNavLinks: ["/cms/admin/NavExtra#NavExtra"],
      actions: ["/cms/admin/BackButton#BackButton"],
      providers: ["/cms/admin/PasswordEye#PasswordEye"],
      graphics: {
        Logo: "/cms/admin/Brand#AdminLogo",
        Icon: "/cms/admin/Brand#AdminIcon",
      },
      afterDashboard: ["/cms/admin/DashboardExtra#DashboardExtra"],
    },
    meta: {
      titleSuffix: " — FitSweet",
      robots: "noindex, nofollow",
    },
  },
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: "ru",
    translations: { ru: ruOverrides },
  },
  collections: [Users, Media, Products, ProductCategories, Moods, SalePoints, PointCategories, CustomSections],
  globals: [Layout, Header, Hero, MoodsSection, Catalog, WhereSection, DeliverySection, Theme, Typography, Seo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || "file:./data/fitsweet.db" },
    migrationDir: path.resolve(dirname, "cms/migrations"),
    push: false,
  }),
  sharp,
});
