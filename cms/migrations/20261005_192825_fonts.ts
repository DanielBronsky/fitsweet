import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`typography\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'inter' NOT NULL,
  	\`body\` text DEFAULT 'inter' NOT NULL,
  	\`accent\` text DEFAULT 'playfair' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`header\` ADD \`logo_font\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`tagline_font\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`menu_font\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`order_font\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`typography\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`logo_font\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`tagline_font\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`menu_font\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`order_font\`;`)
}
