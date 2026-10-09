import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`product_categories\` ADD \`weight_label_ru\` text;`)
  await db.run(sql`ALTER TABLE \`product_categories\` ADD \`weight_label_ro\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`product_categories\` DROP COLUMN \`weight_label_ru\`;`)
  await db.run(sql`ALTER TABLE \`product_categories\` DROP COLUMN \`weight_label_ro\`;`)
}
