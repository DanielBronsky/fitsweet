import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`seo\` ADD \`title_ru\` text DEFAULT '' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`title_ro\` text DEFAULT '' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`description_ru\` text DEFAULT '' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`description_ro\` text DEFAULT '' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`keywords_ru\` text;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`keywords_ro\` text;`)
  for (const lang of ["ru", "ro"]) {
    await db.run(
      sql.raw(`UPDATE seo SET
        title_${lang} = COALESCE((SELECT title FROM seo_locales l WHERE l._parent_id = seo.id AND l._locale = '${lang}'), ''),
        description_${lang} = COALESCE((SELECT description FROM seo_locales l WHERE l._parent_id = seo.id AND l._locale = '${lang}'), ''),
        keywords_${lang} = (SELECT keywords FROM seo_locales l WHERE l._parent_id = seo.id AND l._locale = '${lang}');`),
    )
  }
  await db.run(sql`DROP TABLE \`seo_locales\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`seo_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`keywords\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`seo\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`seo_locales_locale_parent_id_unique\` ON \`seo_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`title_ru\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`title_ro\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`description_ru\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`description_ro\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`keywords_ru\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`keywords_ro\`;`)
}
