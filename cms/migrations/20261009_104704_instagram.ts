import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`instagram_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text,
  	\`show\` integer DEFAULT true,
  	\`url\` text NOT NULL,
  	\`code\` text,
  	\`kind\` text DEFAULT 'post',
  	\`cover_image_id\` integer,
  	\`cover_crops\` text,
  	\`cover_variants\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`instagram_posts__order_idx\` ON \`instagram_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`instagram_posts_cover_cover_image_idx\` ON \`instagram_posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`instagram_posts_updated_at_idx\` ON \`instagram_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`instagram_posts_created_at_idx\` ON \`instagram_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`instagram_section\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_show\` integer DEFAULT true,
  	\`section_background\` text DEFAULT 'cream',
  	\`heading_text_ru\` text NOT NULL,
  	\`heading_text_ro\` text NOT NULL,
  	\`heading_color\` text DEFAULT 'green-900',
  	\`heading_leaf_color\` text DEFAULT 'green-500',
  	\`heading_leaf\` integer DEFAULT true,
  	\`heading_font\` text,
  	\`heading_weight\` text,
  	\`posts_count\` numeric DEFAULT 5,
  	\`posts_open\` text DEFAULT 'modal',
  	\`posts_overlay\` text DEFAULT 'green-900',
  	\`profile_handle\` text DEFAULT 'fitsweet.md' NOT NULL,
  	\`profile_follow_us_ru\` text NOT NULL,
  	\`profile_follow_us_ro\` text NOT NULL,
  	\`profile_description_ru\` text,
  	\`profile_description_ro\` text,
  	\`profile_title_color\` text DEFAULT 'green-900',
  	\`profile_text_color\` text DEFAULT 'muted',
  	\`profile_font\` text,
  	\`profile_cta_ru\` text NOT NULL,
  	\`profile_cta_ro\` text NOT NULL,
  	\`profile_button_background\` text DEFAULT 'green-700',
  	\`profile_button_color\` text DEFAULT 'cream',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`instagram_posts_id\` integer REFERENCES instagram_posts(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_instagram_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`instagram_posts_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`instagram_posts\`;`)
  await db.run(sql`DROP TABLE \`instagram_section\`;`)
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
  	\`reviews_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`moods_id\`) REFERENCES \`moods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sale_points_id\`) REFERENCES \`sale_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`point_categories_id\`) REFERENCES \`point_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`custom_sections_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "product_categories_id", "moods_id", "sale_points_id", "point_categories_id", "custom_sections_id", "reviews_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "product_categories_id", "moods_id", "sale_points_id", "point_categories_id", "custom_sections_id", "reviews_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
}
