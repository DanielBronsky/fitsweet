import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text,
  	\`show\` integer DEFAULT true,
  	\`author_ru\` text NOT NULL,
  	\`author_ro\` text NOT NULL,
  	\`text_ru\` text NOT NULL,
  	\`text_ro\` text NOT NULL,
  	\`product_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews__order_idx\` ON \`reviews\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_product_idx\` ON \`reviews\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews_section\` (
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
  	\`heading_subtitle_ru\` text,
  	\`heading_subtitle_ro\` text,
  	\`heading_subtitle_color\` text DEFAULT 'muted',
  	\`cards_background\` text DEFAULT 'card',
  	\`cards_quote_color\` text DEFAULT 'green-200',
  	\`cards_text_color\` text DEFAULT 'green-900',
  	\`cards_name_color\` text DEFAULT 'green-900',
  	\`cards_font\` text,
  	\`cards_show_product\` integer DEFAULT true,
  	\`cards_chip_background\` text DEFAULT 'sage',
  	\`cards_chip_color\` text DEFAULT 'green-900',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`reviews_id\` integer REFERENCES reviews(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`reviews_section\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`products_id\` integer,
  	\`product_categories_id\` integer,
  	\`moods_id\` integer,
  	\`sale_points_id\` integer,
  	\`point_categories_id\` integer,
  	\`custom_sections_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`moods_id\`) REFERENCES \`moods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sale_points_id\`) REFERENCES \`sale_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`point_categories_id\`) REFERENCES \`point_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`custom_sections_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "product_categories_id", "moods_id", "sale_points_id", "point_categories_id", "custom_sections_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "product_categories_id", "moods_id", "sale_points_id", "point_categories_id", "custom_sections_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_moods_id_idx\` ON \`payload_locked_documents_rels\` (\`moods_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_sale_points_id_idx\` ON \`payload_locked_documents_rels\` (\`sale_points_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_point_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`point_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_custom_sections_id_idx\` ON \`payload_locked_documents_rels\` (\`custom_sections_id\`);`)
}
