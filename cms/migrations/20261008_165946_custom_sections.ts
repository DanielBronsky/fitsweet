import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`product_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text,
  	\`title_ru\` text NOT NULL,
  	\`title_ro\` text NOT NULL,
  	\`in_box\` integer DEFAULT false,
  	\`in_moods\` integer DEFAULT false,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`product_categories__order_idx\` ON \`product_categories\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`product_categories_slug_idx\` ON \`product_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_updated_at_idx\` ON \`product_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_created_at_idx\` ON \`product_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`initial_count\` numeric DEFAULT 8,
  	\`more_text_ru\` text,
  	\`more_text_ro\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_products_order_idx\` ON \`custom_sections_blocks_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_products_parent_id_idx\` ON \`custom_sections_blocks_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_products_path_idx\` ON \`custom_sections_blocks_products\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_products_category_idx\` ON \`custom_sections_blocks_products\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_text_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text_ru\` text,
  	\`text_ro\` text,
  	\`text_color\` text DEFAULT 'muted',
  	\`picture_image_id\` integer,
  	\`picture_crops\` text,
  	\`picture_variants\` text,
  	\`side\` text DEFAULT 'right',
  	\`picture_background\` text DEFAULT 'cream',
  	\`button_show\` integer DEFAULT false,
  	\`button_text_ru\` text,
  	\`button_text_ro\` text,
  	\`button_target\` text DEFAULT 'order' NOT NULL,
  	\`button_section_id\` integer,
  	\`button_url\` text,
  	\`button_new_tab\` integer DEFAULT false,
  	\`button_background\` text DEFAULT 'green-700',
  	\`button_color\` text DEFAULT 'cream',
  	\`block_name\` text,
  	FOREIGN KEY (\`picture_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`button_section_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_text_image_order_idx\` ON \`custom_sections_blocks_text_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_text_image_parent_id_idx\` ON \`custom_sections_blocks_text_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_text_image_path_idx\` ON \`custom_sections_blocks_text_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_text_image_picture_picture_image_idx\` ON \`custom_sections_blocks_text_image\` (\`picture_image_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_text_image_button_button_section_idx\` ON \`custom_sections_blocks_text_image\` (\`button_section_id\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_features_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'lucide:Leaf' NOT NULL,
  	\`title_ru\` text NOT NULL,
  	\`title_ro\` text NOT NULL,
  	\`text_ru\` text,
  	\`text_ro\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_features_items_order_idx\` ON \`custom_sections_blocks_features_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_features_items_parent_id_idx\` ON \`custom_sections_blocks_features_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`card_background\` text DEFAULT 'white',
  	\`icon_color\` text DEFAULT 'green-700',
  	\`title_color\` text DEFAULT 'green-900',
  	\`text_color\` text DEFAULT 'muted',
  	\`title_font\` text,
  	\`title_weight\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_features_order_idx\` ON \`custom_sections_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_features_parent_id_idx\` ON \`custom_sections_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_features_path_idx\` ON \`custom_sections_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`picture_image_id\` integer NOT NULL,
  	\`picture_crops\` text,
  	\`picture_variants\` text,
  	\`caption_ru\` text,
  	\`caption_ro\` text,
  	FOREIGN KEY (\`picture_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_gallery_items_order_idx\` ON \`custom_sections_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_gallery_items_parent_id_idx\` ON \`custom_sections_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_gallery_items_picture_picture_ima_idx\` ON \`custom_sections_blocks_gallery_items\` (\`picture_image_id\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '4',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_gallery_order_idx\` ON \`custom_sections_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_gallery_parent_id_idx\` ON \`custom_sections_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_gallery_path_idx\` ON \`custom_sections_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question_ru\` text NOT NULL,
  	\`question_ro\` text NOT NULL,
  	\`answer_ru\` text NOT NULL,
  	\`answer_ro\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_faq_items_order_idx\` ON \`custom_sections_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_faq_items_parent_id_idx\` ON \`custom_sections_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`card_background\` text DEFAULT 'white',
  	\`question_color\` text DEFAULT 'green-900',
  	\`answer_color\` text DEFAULT 'muted',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_faq_order_idx\` ON \`custom_sections_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_faq_parent_id_idx\` ON \`custom_sections_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_blocks_faq_path_idx\` ON \`custom_sections_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`custom_sections\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`heading_text_ru\` text NOT NULL,
  	\`heading_text_ro\` text NOT NULL,
  	\`heading_color\` text DEFAULT 'green-900',
  	\`heading_leaf_color\` text DEFAULT 'green-500',
  	\`heading_leaf\` integer DEFAULT true,
  	\`heading_font\` text,
  	\`heading_weight\` text,
  	\`heading_align\` text DEFAULT 'center',
  	\`heading_subtitle_ru\` text,
  	\`heading_subtitle_ro\` text,
  	\`heading_subtitle_color\` text DEFAULT 'muted',
  	\`background\` text DEFAULT 'white',
  	\`show\` integer DEFAULT true,
  	\`anchor\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`custom_sections_anchor_idx\` ON \`custom_sections\` (\`anchor\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_updated_at_idx\` ON \`custom_sections\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`custom_sections_created_at_idx\` ON \`custom_sections\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`category_id\` integer REFERENCES product_categories(id);`)
  await db.run(sql`CREATE INDEX \`products_category_idx\` ON \`products\` (\`category_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`product_categories_id\` integer REFERENCES product_categories(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`custom_sections_id\` integer REFERENCES custom_sections(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_custom_sections_id_idx\` ON \`payload_locked_documents_rels\` (\`custom_sections_id\`);`)
  await db.run(sql`ALTER TABLE \`layout_blocks\` ADD \`custom_id\` integer REFERENCES custom_sections(id);`)
  await db.run(sql`CREATE INDEX \`layout_blocks_custom_idx\` ON \`layout_blocks\` (\`custom_id\`);`)
  await db.run(sql`ALTER TABLE \`header_menu_items\` ADD \`section_id\` integer REFERENCES custom_sections(id);`)
  await db.run(sql`CREATE INDEX \`header_menu_items_section_idx\` ON \`header_menu_items\` (\`section_id\`);`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`order_section_id\` integer REFERENCES custom_sections(id);`)
  await db.run(sql`CREATE INDEX \`header_order_order_section_idx\` ON \`header\` (\`order_section_id\`);`)
  await db.run(sql`ALTER TABLE \`hero_buttons_items\` ADD \`section_id\` integer REFERENCES custom_sections(id);`)
  await db.run(sql`CREATE INDEX \`hero_buttons_items_section_idx\` ON \`hero_buttons_items\` (\`section_id\`);`)
  await db.run(sql`ALTER TABLE \`catalog\` ADD \`section_category_id\` integer REFERENCES product_categories(id);`)
  await db.run(sql`CREATE INDEX \`catalog_section_section_category_idx\` ON \`catalog\` (\`section_category_id\`);`)
  await db.run(sql`ALTER TABLE \`delivery_section\` ADD \`button_section_id\` integer REFERENCES custom_sections(id);`)
  await db.run(sql`CREATE INDEX \`delivery_section_button_button_section_idx\` ON \`delivery_section\` (\`button_section_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`product_categories\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_products\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_text_image\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_features_items\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`custom_sections_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`custom_sections\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_products\` (
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
  await db.run(sql`INSERT INTO \`__new_products\`("id", "_order", "title", "name_ru", "name_ro", "short_name_ru", "short_name_ro", "price", "weight", "kcal", "protein", "fat", "carbs", "ingredients_ru", "ingredients_ro", "picture_image_id", "picture_crops", "picture_variants", "active", "slug", "updated_at", "created_at") SELECT "id", "_order", "title", "name_ru", "name_ro", "short_name_ru", "short_name_ro", "price", "weight", "kcal", "protein", "fat", "carbs", "ingredients_ru", "ingredients_ro", "picture_image_id", "picture_crops", "picture_variants", "active", "slug", "updated_at", "created_at" FROM \`products\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`ALTER TABLE \`__new_products\` RENAME TO \`products\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`products__order_idx\` ON \`products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_picture_picture_image_idx\` ON \`products\` (\`picture_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`products_id\` integer,
  	\`moods_id\` integer,
  	\`sale_points_id\` integer,
  	\`point_categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`moods_id\`) REFERENCES \`moods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sale_points_id\`) REFERENCES \`sale_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`point_categories_id\`) REFERENCES \`point_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "moods_id", "sale_points_id", "point_categories_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "moods_id", "sale_points_id", "point_categories_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_moods_id_idx\` ON \`payload_locked_documents_rels\` (\`moods_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_sale_points_id_idx\` ON \`payload_locked_documents_rels\` (\`sale_points_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_point_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`point_categories_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_layout_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`layout\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_layout_blocks\`("_order", "_parent_id", "id", "block") SELECT "_order", "_parent_id", "id", "block" FROM \`layout_blocks\`;`)
  await db.run(sql`DROP TABLE \`layout_blocks\`;`)
  await db.run(sql`ALTER TABLE \`__new_layout_blocks\` RENAME TO \`layout_blocks\`;`)
  await db.run(sql`CREATE INDEX \`layout_blocks_order_idx\` ON \`layout_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`layout_blocks_parent_id_idx\` ON \`layout_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_header_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label_ru\` text,
  	\`label_ro\` text,
  	\`target\` text DEFAULT 'catalog',
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_header_menu_items\`("_order", "_parent_id", "id", "label_ru", "label_ro", "target", "url", "new_tab") SELECT "_order", "_parent_id", "id", "label_ru", "label_ro", "target", "url", "new_tab" FROM \`header_menu_items\`;`)
  await db.run(sql`DROP TABLE \`header_menu_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_header_menu_items\` RENAME TO \`header_menu_items\`;`)
  await db.run(sql`CREATE INDEX \`header_menu_items_order_idx\` ON \`header_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_menu_items_parent_id_idx\` ON \`header_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style_background\` text DEFAULT 'cream' NOT NULL,
  	\`logo_show\` integer DEFAULT true,
  	\`logo_kind\` text DEFAULT 'text',
  	\`logo_text\` text DEFAULT 'FitSweet',
  	\`logo_color\` text DEFAULT 'green-900',
  	\`logo_font\` text,
  	\`logo_weight\` text,
  	\`logo_image_image_id\` integer,
  	\`logo_image_variants\` text,
  	\`tagline_show\` integer DEFAULT true,
  	\`tagline_text_ru\` text,
  	\`tagline_text_ro\` text,
  	\`tagline_color\` text DEFAULT 'green-500',
  	\`tagline_font\` text,
  	\`tagline_weight\` text,
  	\`menu_show\` integer DEFAULT true,
  	\`menu_color\` text DEFAULT 'green-900',
  	\`menu_hover_color\` text DEFAULT 'green-700',
  	\`menu_font\` text,
  	\`menu_weight\` text,
  	\`language_show\` integer DEFAULT true,
  	\`language_color\` text DEFAULT 'green-700',
  	\`order_show\` integer DEFAULT true,
  	\`order_text_ru\` text,
  	\`order_text_ro\` text,
  	\`order_target\` text DEFAULT 'order' NOT NULL,
  	\`order_url\` text,
  	\`order_new_tab\` integer DEFAULT false,
  	\`order_background\` text DEFAULT 'green-700',
  	\`order_color\` text DEFAULT 'cream',
  	\`order_font\` text,
  	\`order_weight\` text,
  	\`cart_show\` integer DEFAULT true,
  	\`cart_color\` text DEFAULT 'green-900',
  	\`cart_badge\` text DEFAULT 'green-700',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_header\`("id", "style_background", "logo_show", "logo_kind", "logo_text", "logo_color", "logo_font", "logo_weight", "logo_image_image_id", "logo_image_variants", "tagline_show", "tagline_text_ru", "tagline_text_ro", "tagline_color", "tagline_font", "tagline_weight", "menu_show", "menu_color", "menu_hover_color", "menu_font", "menu_weight", "language_show", "language_color", "order_show", "order_text_ru", "order_text_ro", "order_target", "order_url", "order_new_tab", "order_background", "order_color", "order_font", "order_weight", "cart_show", "cart_color", "cart_badge", "updated_at", "created_at") SELECT "id", "style_background", "logo_show", "logo_kind", "logo_text", "logo_color", "logo_font", "logo_weight", "logo_image_image_id", "logo_image_variants", "tagline_show", "tagline_text_ru", "tagline_text_ro", "tagline_color", "tagline_font", "tagline_weight", "menu_show", "menu_color", "menu_hover_color", "menu_font", "menu_weight", "language_show", "language_color", "order_show", "order_text_ru", "order_text_ro", "order_target", "order_url", "order_new_tab", "order_background", "order_color", "order_font", "order_weight", "cart_show", "cart_color", "cart_badge", "updated_at", "created_at" FROM \`header\`;`)
  await db.run(sql`DROP TABLE \`header\`;`)
  await db.run(sql`ALTER TABLE \`__new_header\` RENAME TO \`header\`;`)
  await db.run(sql`CREATE INDEX \`header_logo_image_logo_image_image_idx\` ON \`header\` (\`logo_image_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_hero_buttons_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text_ru\` text NOT NULL,
  	\`text_ro\` text NOT NULL,
  	\`target\` text DEFAULT 'catalog' NOT NULL,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`background\` text DEFAULT 'green-700',
  	\`color\` text DEFAULT 'cream',
  	\`border\` text,
  	\`font\` text,
  	\`weight\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_hero_buttons_items\`("_order", "_parent_id", "id", "text_ru", "text_ro", "target", "url", "new_tab", "background", "color", "border", "font", "weight") SELECT "_order", "_parent_id", "id", "text_ru", "text_ro", "target", "url", "new_tab", "background", "color", "border", "font", "weight" FROM \`hero_buttons_items\`;`)
  await db.run(sql`DROP TABLE \`hero_buttons_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_hero_buttons_items\` RENAME TO \`hero_buttons_items\`;`)
  await db.run(sql`CREATE INDEX \`hero_buttons_items_order_idx\` ON \`hero_buttons_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`hero_buttons_items_parent_id_idx\` ON \`hero_buttons_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_catalog\` (
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
  	\`cards_blend_photo\` integer DEFAULT true,
  	\`cards_name_font\` text,
  	\`cards_name_weight\` text,
  	\`cards_add_text_ru\` text NOT NULL,
  	\`cards_add_text_ro\` text NOT NULL,
  	\`cards_added_text_ru\` text NOT NULL,
  	\`cards_added_text_ro\` text NOT NULL,
  	\`cards_button_color\` text DEFAULT 'green-700',
  	\`cards_button_active\` text DEFAULT 'green-700',
  	\`more_show\` integer DEFAULT true,
  	\`more_initial_count\` numeric DEFAULT 8,
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
  await db.run(sql`INSERT INTO \`__new_catalog\`("id", "section_show", "section_background", "heading_text_ru", "heading_text_ro", "heading_color", "heading_leaf_color", "heading_leaf", "heading_font", "heading_weight", "cards_background", "cards_name_color", "cards_info_color", "cards_price_color", "cards_blend_photo", "cards_name_font", "cards_name_weight", "cards_add_text_ru", "cards_add_text_ro", "cards_added_text_ru", "cards_added_text_ro", "cards_button_color", "cards_button_active", "more_show", "more_initial_count", "more_text_ru", "more_text_ro", "more_background", "more_color", "more_border", "more_font", "updated_at", "created_at") SELECT "id", "section_show", "section_background", "heading_text_ru", "heading_text_ro", "heading_color", "heading_leaf_color", "heading_leaf", "heading_font", "heading_weight", "cards_background", "cards_name_color", "cards_info_color", "cards_price_color", "cards_blend_photo", "cards_name_font", "cards_name_weight", "cards_add_text_ru", "cards_add_text_ro", "cards_added_text_ru", "cards_added_text_ro", "cards_button_color", "cards_button_active", "more_show", "more_initial_count", "more_text_ru", "more_text_ro", "more_background", "more_color", "more_border", "more_font", "updated_at", "created_at" FROM \`catalog\`;`)
  await db.run(sql`DROP TABLE \`catalog\`;`)
  await db.run(sql`ALTER TABLE \`__new_catalog\` RENAME TO \`catalog\`;`)
  await db.run(sql`CREATE TABLE \`__new_delivery_section\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_show\` integer DEFAULT true,
  	\`section_background\` text DEFAULT 'beige',
  	\`pricing_price\` numeric DEFAULT 40 NOT NULL,
  	\`pricing_free_from\` numeric DEFAULT 300 NOT NULL,
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
  	\`media_show\` integer DEFAULT true,
  	\`media_picture_image_id\` integer,
  	\`media_picture_crops\` text,
  	\`media_picture_variants\` text,
  	\`media_background\` text DEFAULT 'cream',
  	\`media_side\` text DEFAULT 'left',
  	\`steps_show\` integer DEFAULT true,
  	\`steps_number_color\` text DEFAULT 'green-500',
  	\`steps_color\` text DEFAULT 'green-900',
  	\`steps_font\` text,
  	\`terms_show\` integer DEFAULT true,
  	\`terms_background\` text DEFAULT 'white',
  	\`terms_title_color\` text DEFAULT 'muted',
  	\`terms_value_color\` text DEFAULT 'green-900',
  	\`terms_font\` text,
  	\`terms_weight\` text,
  	\`button_show\` integer DEFAULT true,
  	\`button_text_ru\` text,
  	\`button_text_ro\` text,
  	\`button_target\` text DEFAULT 'order' NOT NULL,
  	\`button_url\` text,
  	\`button_new_tab\` integer DEFAULT false,
  	\`button_background\` text DEFAULT 'green-700',
  	\`button_color\` text DEFAULT 'cream',
  	\`button_font\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`media_picture_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_delivery_section\`("id", "section_show", "section_background", "pricing_price", "pricing_free_from", "heading_text_ru", "heading_text_ro", "heading_color", "heading_leaf_color", "heading_leaf", "heading_font", "heading_weight", "heading_subtitle_ru", "heading_subtitle_ro", "heading_subtitle_color", "media_show", "media_picture_image_id", "media_picture_crops", "media_picture_variants", "media_background", "media_side", "steps_show", "steps_number_color", "steps_color", "steps_font", "terms_show", "terms_background", "terms_title_color", "terms_value_color", "terms_font", "terms_weight", "button_show", "button_text_ru", "button_text_ro", "button_target", "button_url", "button_new_tab", "button_background", "button_color", "button_font", "updated_at", "created_at") SELECT "id", "section_show", "section_background", "pricing_price", "pricing_free_from", "heading_text_ru", "heading_text_ro", "heading_color", "heading_leaf_color", "heading_leaf", "heading_font", "heading_weight", "heading_subtitle_ru", "heading_subtitle_ro", "heading_subtitle_color", "media_show", "media_picture_image_id", "media_picture_crops", "media_picture_variants", "media_background", "media_side", "steps_show", "steps_number_color", "steps_color", "steps_font", "terms_show", "terms_background", "terms_title_color", "terms_value_color", "terms_font", "terms_weight", "button_show", "button_text_ru", "button_text_ro", "button_target", "button_url", "button_new_tab", "button_background", "button_color", "button_font", "updated_at", "created_at" FROM \`delivery_section\`;`)
  await db.run(sql`DROP TABLE \`delivery_section\`;`)
  await db.run(sql`ALTER TABLE \`__new_delivery_section\` RENAME TO \`delivery_section\`;`)
  await db.run(sql`CREATE INDEX \`delivery_section_media_picture_media_picture_image_idx\` ON \`delivery_section\` (\`media_picture_image_id\`);`)
}
