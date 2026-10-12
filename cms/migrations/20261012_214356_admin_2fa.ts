import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`invite_token\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`chat_id\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_username\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`connected_at\` text;`)
  await db.run(sql`CREATE INDEX \`users_invite_token_idx\` ON \`users\` (\`invite_token\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`users_invite_token_idx\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`invite_token\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`chat_id\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`telegram_username\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`connected_at\`;`)
}
