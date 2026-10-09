import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`header_menu_items\` (
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
  await db.run(sql`CREATE INDEX \`header_menu_items_order_idx\` ON \`header_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`header_menu_items_parent_id_idx\` ON \`header_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style_background\` text DEFAULT 'cream' NOT NULL,
  	\`logo_show\` integer DEFAULT true,
  	\`logo_kind\` text DEFAULT 'text',
  	\`logo_text\` text DEFAULT 'FitSweet',
  	\`logo_color\` text DEFAULT 'green-900',
  	\`logo_image_image_id\` integer,
  	\`logo_image_variants\` text,
  	\`tagline_show\` integer DEFAULT true,
  	\`tagline_text_ru\` text,
  	\`tagline_text_ro\` text,
  	\`tagline_color\` text DEFAULT 'green-500',
  	\`menu_show\` integer DEFAULT true,
  	\`menu_color\` text DEFAULT 'green-900',
  	\`menu_hover_color\` text DEFAULT 'green-700',
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
  	\`cart_show\` integer DEFAULT true,
  	\`cart_color\` text DEFAULT 'green-900',
  	\`cart_badge\` text DEFAULT 'green-700',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`header_logo_image_logo_image_image_idx\` ON \`header\` (\`logo_image_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`header_menu_items\`;`)
  await db.run(sql`DROP TABLE \`header\`;`)
}
