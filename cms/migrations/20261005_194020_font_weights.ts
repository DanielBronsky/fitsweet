import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`header\` ADD \`logo_weight\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`tagline_weight\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`menu_weight\` text;`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`order_weight\` text;`)
  await db.run(sql`ALTER TABLE \`typography\` ADD \`heading_weight\` text DEFAULT '700' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`typography\` ADD \`accent_weight\` text DEFAULT '400' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`logo_weight\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`tagline_weight\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`menu_weight\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`order_weight\`;`)
  await db.run(sql`ALTER TABLE \`typography\` DROP COLUMN \`heading_weight\`;`)
  await db.run(sql`ALTER TABLE \`typography\` DROP COLUMN \`accent_weight\`;`)
}
