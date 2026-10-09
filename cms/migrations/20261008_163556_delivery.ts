import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`delivery_section_steps_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text_ru\` text,
  	\`text_ro\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`delivery_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`delivery_section_steps_items_order_idx\` ON \`delivery_section_steps_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`delivery_section_steps_items_parent_id_idx\` ON \`delivery_section_steps_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`delivery_section_terms_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title_ru\` text,
  	\`title_ro\` text,
  	\`value_ru\` text,
  	\`value_ro\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`delivery_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`delivery_section_terms_items_order_idx\` ON \`delivery_section_terms_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`delivery_section_terms_items_parent_id_idx\` ON \`delivery_section_terms_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`delivery_section\` (
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
  await db.run(sql`CREATE INDEX \`delivery_section_media_picture_media_picture_image_idx\` ON \`delivery_section\` (\`media_picture_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`delivery_section_steps_items\`;`)
  await db.run(sql`DROP TABLE \`delivery_section_terms_items\`;`)
  await db.run(sql`DROP TABLE \`delivery_section\`;`)
}
