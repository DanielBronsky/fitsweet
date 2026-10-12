import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`seo_business_hours_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`seo_business_hours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_business_hours_days_order_idx\` ON \`seo_business_hours_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`seo_business_hours_days_parent_idx\` ON \`seo_business_hours_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`seo_business_hours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`opens\` text NOT NULL,
  	\`closes\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`seo\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_business_hours_order_idx\` ON \`seo_business_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`seo_business_hours_parent_id_idx\` ON \`seo_business_hours\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_show\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_text_ru\` text;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_text_ro\` text;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_hint_ru\` text;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_hint_ro\` text;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_background\` text DEFAULT 'green-700';`)
  await db.run(sql`ALTER TABLE \`reviews_section\` ADD \`google_color\` text DEFAULT 'cream';`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_type\` text DEFAULT 'Bakery';`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_street\` text;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_city\` text DEFAULT 'Chișinău';`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_postal_code\` text;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_lat\` numeric;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_lng\` numeric;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_area_served\` text DEFAULT 'Chișinău';`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_price_range\` text;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_google_profile\` text;`)
  await db.run(sql`ALTER TABLE \`seo\` ADD \`business_review_url\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`seo_business_hours_days\`;`)
  await db.run(sql`DROP TABLE \`seo_business_hours\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_show\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_text_ru\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_text_ro\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_hint_ru\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_hint_ro\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_background\`;`)
  await db.run(sql`ALTER TABLE \`reviews_section\` DROP COLUMN \`google_color\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_type\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_street\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_city\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_postal_code\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_lat\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_lng\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_area_served\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_price_range\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_google_profile\`;`)
  await db.run(sql`ALTER TABLE \`seo\` DROP COLUMN \`business_review_url\`;`)
}
