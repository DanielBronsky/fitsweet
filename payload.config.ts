import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ru } from "@payloadcms/translations/languages/ru";
import sharp from "sharp";

import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { Theme } from "./cms/globals/Theme";
import { Seo } from "./cms/globals/Seo";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: " — FitSweet",
      // Админка не должна попадать в поиск
      robots: "noindex, nofollow",
    },
  },
  // Интерфейс админки — на русском
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: "ru",
  },
  // Языки контента сайта: у полей с localized: true в админке есть переключатель RU / RO
  localization: {
    locales: [
      { code: "ru", label: "Русский" },
      { code: "ro", label: "Română" },
    ],
    defaultLocale: "ru",
    fallback: true,
  },
  collections: [Users, Media],
  globals: [Theme, Seo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || "file:./data/fitsweet.db" },
    migrationDir: path.resolve(dirname, "cms/migrations"),
    // Схема меняется только миграциями (pnpm payload migrate:create → pnpm migrate)
    push: false,
  }),
  sharp,
});
