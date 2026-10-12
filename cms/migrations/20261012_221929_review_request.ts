import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_ask_after_done\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_ask_text_ru\` text;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_ask_text_ro\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_ask_after_done\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_ask_text_ru\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_ask_text_ro\`;`)
}
