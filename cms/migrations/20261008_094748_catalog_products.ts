import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`products_moods\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_moods_order_idx\` ON \`products_moods\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_moods_parent_idx\` ON \`products_moods\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text,
  	\`name_ru\` text NOT NULL,
  	\`name_ro\` text NOT NULL,
  	\`short_name_ru\` text,
  	\`short_name_ro\` text,
  	\`price\` numeric NOT NULL,
  	\`weight\` numeric NOT NULL,
  	\`kcal\` numeric,
  	\`protein\` numeric,
  	\`fat\` numeric,
  	\`carbs\` numeric,
  	\`ingredients_ru\` text,
  	\`ingredients_ro\` text,
  	\`picture_image_id\` integer,
  	\`picture_crops\` text,
  	\`picture_variants\` text,
  	\`active\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`picture_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products__order_idx\` ON \`products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_picture_picture_image_idx\` ON \`products\` (\`picture_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`catalog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_show\` integer DEFAULT true,
  	\`section_background\` text DEFAULT 'white',
  	\`heading_text_ru\` text NOT NULL,
  	\`heading_text_ro\` text NOT NULL,
  	\`heading_color\` text DEFAULT 'green-900',
  	\`heading_leaf_color\` text DEFAULT 'green-500',
  	\`heading_leaf\` integer DEFAULT true,
  	\`heading_font\` text,
  	\`heading_weight\` text,
  	\`cards_background\` text DEFAULT 'card',
  	\`cards_name_color\` text DEFAULT 'green-900',
  	\`cards_info_color\` text DEFAULT 'muted',
  	\`cards_price_color\` text DEFAULT 'green-900',
  	\`cards_name_font\` text,
  	\`cards_name_weight\` text,
  	\`cards_add_text_ru\` text NOT NULL,
  	\`cards_add_text_ro\` text NOT NULL,
  	\`cards_added_text_ru\` text NOT NULL,
  	\`cards_added_text_ro\` text NOT NULL,
  	\`cards_button_color\` text DEFAULT 'green-700',
  	\`cards_button_active\` text DEFAULT 'green-700',
  	\`more_show\` integer DEFAULT true,
  	\`more_text_ru\` text,
  	\`more_text_ro\` text,
  	\`more_background\` text DEFAULT 'white',
  	\`more_color\` text DEFAULT 'green-900',
  	\`more_border\` text DEFAULT 'green-200',
  	\`more_font\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`products_moods\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`catalog\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
