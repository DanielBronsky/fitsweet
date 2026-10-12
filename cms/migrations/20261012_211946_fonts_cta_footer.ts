import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`final_cta_section\` ADD \`heading_subtitle_font\` text;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` ADD \`heading_subtitle_weight\` text;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` ADD \`primary_font\` text;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` ADD \`primary_weight\` text;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` ADD \`secondary_font\` text;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` ADD \`secondary_weight\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`style_menu_font\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`style_menu_weight\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`style_contacts_font\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`style_contacts_weight\` text;`)
  await db.run(sql`ALTER TABLE \`footer\` ADD \`style_copyright_font\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`final_cta_section\` DROP COLUMN \`heading_subtitle_font\`;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` DROP COLUMN \`heading_subtitle_weight\`;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` DROP COLUMN \`primary_font\`;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` DROP COLUMN \`primary_weight\`;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` DROP COLUMN \`secondary_font\`;`)
  await db.run(sql`ALTER TABLE \`final_cta_section\` DROP COLUMN \`secondary_weight\`;`)
  await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`style_menu_font\`;`)
  await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`style_menu_weight\`;`)
  await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`style_contacts_font\`;`)
  await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`style_contacts_weight\`;`)
  await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`style_copyright_font\`;`)
}
