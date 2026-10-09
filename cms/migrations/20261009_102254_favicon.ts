import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`seo\` ADD \`favicon_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`favicon_background\` text;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`favicon_variants\` text;`)
  await db.run(sql`CREATE INDEX \`seo_favicon_favicon_image_idx\` ON \`seo\` (\`favicon_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_seo\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title_ru\` text NOT NULL,
  	\`title_ro\` text NOT NULL,
  	\`description_ru\` text NOT NULL,
  	\`description_ro\` text NOT NULL,
  	\`keywords_ru\` text,
  	\`keywords_ro\` text,
  	\`og_image_image_id\` integer,
  	\`og_image_crops\` text,
  	\`og_image_variants\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`og_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_seo\`("id", "title_ru", "title_ro", "description_ru", "description_ro", "keywords_ru", "keywords_ro", "og_image_image_id", "og_image_crops", "og_image_variants", "updated_at", "created_at") SELECT "id", "title_ru", "title_ro", "description_ru", "description_ro", "keywords_ru", "keywords_ro", "og_image_image_id", "og_image_crops", "og_image_variants", "updated_at", "created_at" FROM \`seo\`;`)
  await db.run(sql`DROP TABLE \`seo\`;`)
  await db.run(sql`ALTER TABLE \`__new_seo\` RENAME TO \`seo\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`seo_og_image_og_image_image_idx\` ON \`seo\` (\`og_image_image_id\`);`)
}
