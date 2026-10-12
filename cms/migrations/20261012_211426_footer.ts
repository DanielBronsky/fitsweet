import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`footer_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label_ru\` text,
  	\`label_ro\` text,
  	\`target\` text DEFAULT 'catalog',
  	\`section_id\` integer,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`section_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_menu_items_order_idx\` ON \`footer_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_items_parent_id_idx\` ON \`footer_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_menu_items_section_idx\` ON \`footer_menu_items\` (\`section_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_contacts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'phone' NOT NULL,
  	\`value\` text NOT NULL,
  	\`text_ru\` text,
  	\`text_ro\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_contacts_items_order_idx\` ON \`footer_contacts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_contacts_items_parent_id_idx\` ON \`footer_contacts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style_background\` text DEFAULT 'cream',
  	\`style_divider\` text DEFAULT 'green-200',
  	\`style_color\` text DEFAULT 'green-900',
  	\`style_hover\` text DEFAULT 'green-700',
  	\`style_muted\` text DEFAULT 'muted',
  	\`logo_show\` integer DEFAULT true,
  	\`menu_show\` integer DEFAULT true,
  	\`menu_mode\` text DEFAULT 'header',
  	\`contacts_icons\` integer DEFAULT true,
  	\`bottom_copyright_ru\` text NOT NULL,
  	\`bottom_copyright_ro\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`footer_menu_items\`;`)
  await db.run(sql`DROP TABLE \`footer_contacts_items\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
}
