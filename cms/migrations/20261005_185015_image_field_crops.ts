import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_seo\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`og_image_image_id\` integer,
  	\`og_image_crops\` text,
  	\`og_image_variants\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`og_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_seo\`("id", "updated_at", "created_at") SELECT "id", "updated_at", "created_at" FROM \`seo\`;`)
  await db.run(sql`DROP TABLE \`seo\`;`)
  await db.run(sql`ALTER TABLE \`__new_seo\` RENAME TO \`seo\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`seo_og_image_og_image_image_idx\` ON \`seo\` (\`og_image_image_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`focal_x\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`focal_y\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_url\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_width\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_height\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_mime_type\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_filesize\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_filename\` text;`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`crops\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_seo\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`og_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_seo\`("id", "updated_at", "created_at") SELECT "id", "updated_at", "created_at" FROM \`seo\`;`)
  await db.run(sql`DROP TABLE \`seo\`;`)
  await db.run(sql`ALTER TABLE \`__new_seo\` RENAME TO \`seo\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`seo_og_image_idx\` ON \`seo\` (\`og_image_id\`);`)
  await db.run(sql`DROP INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\`;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`crops\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants\` text;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`focal_x\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`focal_y\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_url\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_width\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_height\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_mime_type\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_filesize\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_filename\`;`)
}
