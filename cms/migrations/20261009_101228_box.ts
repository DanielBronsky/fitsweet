import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`box_section\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_show\` integer DEFAULT true,
  	\`section_background\` text DEFAULT 'beige',
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
  	\`sizes_initial\` numeric DEFAULT 8 NOT NULL,
  	\`texts_choose_qty_ru\` text NOT NULL,
  	\`texts_choose_qty_ro\` text NOT NULL,
  	\`texts_your_box_ru\` text NOT NULL,
  	\`texts_your_box_ro\` text NOT NULL,
  	\`texts_manual_pick_ru\` text NOT NULL,
  	\`texts_manual_pick_ro\` text NOT NULL,
  	\`texts_hide_manual_ru\` text NOT NULL,
  	\`texts_hide_manual_ro\` text NOT NULL,
  	\`texts_total_ru\` text NOT NULL,
  	\`texts_total_ro\` text NOT NULL,
  	\`texts_checkout_ru\` text NOT NULL,
  	\`texts_checkout_ro\` text NOT NULL,
  	\`texts_add_more_ru\` text NOT NULL,
  	\`texts_add_more_ro\` text NOT NULL,
  	\`style_panel\` text DEFAULT 'white',
  	\`style_border\` text DEFAULT 'green-200',
  	\`style_accent\` text DEFAULT 'green-700',
  	\`style_accent_text\` text DEFAULT 'cream',
  	\`style_text\` text DEFAULT 'green-900',
  	\`style_muted\` text DEFAULT 'muted',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`box_section_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`box_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`box_section_numbers_order_parent_idx\` ON \`box_section_numbers\` (\`order\`,\`parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`box_section\`;`)
  await db.run(sql`DROP TABLE \`box_section_numbers\`;`)
}
