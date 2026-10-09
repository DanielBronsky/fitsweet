import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`hero_heading_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text_ru\` text NOT NULL,
  	\`text_ro\` text NOT NULL,
  	\`color\` text DEFAULT 'green-900',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_heading_lines_order_idx\` ON \`hero_heading_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`hero_heading_lines_parent_id_idx\` ON \`hero_heading_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`hero_buttons_items\` (
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
  await db.run(sql`CREATE INDEX \`hero_buttons_items_order_idx\` ON \`hero_buttons_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`hero_buttons_items_parent_id_idx\` ON \`hero_buttons_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`hero_features_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text_ru\` text,
  	\`text_ro\` text,
  	\`icon\` text DEFAULT 'tasty',
  	\`icon_image_image_id\` integer,
  	\`icon_image_variants\` text,
  	FOREIGN KEY (\`icon_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_features_items_order_idx\` ON \`hero_features_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`hero_features_items_parent_id_idx\` ON \`hero_features_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`hero_features_items_icon_image_icon_image_image_idx\` ON \`hero_features_items\` (\`icon_image_image_id\`);`)
  await db.run(sql`CREATE TABLE \`hero\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_show\` integer DEFAULT true,
  	\`section_background\` text DEFAULT 'cream',
  	\`heading_font\` text,
  	\`heading_weight\` text,
  	\`heading_size\` text DEFAULT '100',
  	\`subtitle_show\` integer DEFAULT true,
  	\`subtitle_text_ru\` text,
  	\`subtitle_text_ro\` text,
  	\`subtitle_color\` text DEFAULT 'muted',
  	\`subtitle_font\` text,
  	\`subtitle_weight\` text,
  	\`media_show\` integer DEFAULT true,
  	\`media_picture_image_id\` integer,
  	\`media_picture_crops\` text,
  	\`media_picture_variants\` text,
  	\`media_background\` text DEFAULT 'sage',
  	\`media_stamp_show\` integer DEFAULT true,
  	\`media_stamp_text\` text DEFAULT 'FIT & SWEET · GUILT-FREE ·',
  	\`media_stamp_color\` text DEFAULT 'green-700',
  	\`features_show\` integer DEFAULT true,
  	\`features_icon_color\` text DEFAULT 'green-700',
  	\`features_color\` text DEFAULT 'green-900',
  	\`features_font\` text,
  	\`features_weight\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`media_picture_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_media_picture_media_picture_image_idx\` ON \`hero\` (\`media_picture_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`hero_heading_lines\`;`)
  await db.run(sql`DROP TABLE \`hero_buttons_items\`;`)
  await db.run(sql`DROP TABLE \`hero_features_items\`;`)
  await db.run(sql`DROP TABLE \`hero\`;`)
}
