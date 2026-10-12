import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`final_cta_section\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_show\` integer DEFAULT true,
  	\`section_background\` text DEFAULT 'olive',
  	\`heading_text_ru\` text NOT NULL,
  	\`heading_text_ro\` text NOT NULL,
  	\`heading_color\` text DEFAULT 'cream',
  	\`heading_subtitle_color\` text DEFAULT 'cream',
  	\`heading_font\` text,
  	\`heading_weight\` text,
  	\`heading_subtitle_ru\` text,
  	\`heading_subtitle_ro\` text,
  	\`heading_leaf\` integer DEFAULT true,
  	\`heading_leaf_color\` text DEFAULT 'green-200',
  	\`media_show\` integer DEFAULT true,
  	\`media_picture_image_id\` integer,
  	\`media_picture_crops\` text,
  	\`media_picture_variants\` text,
  	\`media_opacity\` numeric DEFAULT 70,
  	\`media_fade\` integer DEFAULT true,
  	\`primary_text_ru\` text NOT NULL,
  	\`primary_text_ro\` text NOT NULL,
  	\`primary_target\` text DEFAULT 'catalog' NOT NULL,
  	\`primary_section_id\` integer,
  	\`primary_url\` text,
  	\`primary_new_tab\` integer DEFAULT false,
  	\`primary_background\` text DEFAULT 'cream',
  	\`primary_color\` text DEFAULT 'green-900',
  	\`secondary_show\` integer DEFAULT false,
  	\`secondary_text_ru\` text,
  	\`secondary_text_ro\` text,
  	\`secondary_target\` text DEFAULT 'box' NOT NULL,
  	\`secondary_section_id\` integer,
  	\`secondary_url\` text,
  	\`secondary_new_tab\` integer DEFAULT false,
  	\`secondary_color\` text DEFAULT 'cream',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`media_picture_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`primary_section_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`secondary_section_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`final_cta_section_media_picture_media_picture_image_idx\` ON \`final_cta_section\` (\`media_picture_image_id\`);`)
  await db.run(sql`CREATE INDEX \`final_cta_section_primary_primary_section_idx\` ON \`final_cta_section\` (\`primary_section_id\`);`)
  await db.run(sql`CREATE INDEX \`final_cta_section_secondary_secondary_section_idx\` ON \`final_cta_section\` (\`secondary_section_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`final_cta_section\`;`)
}
