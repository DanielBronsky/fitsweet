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
import { Header } from "./cms/globals/Header";
import { Typography } from "./cms/globals/Typography";
import { ruOverrides } from "./cms/i18n-ru";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
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
  collections: [Users, Media],
  globals: [Header, Theme, Typography, Seo],
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
