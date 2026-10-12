import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`managers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`phone\` text,
  	\`username\` text,
  	\`active\` integer DEFAULT true,
  	\`invite_token\` text,
  	\`chat_id\` text,
  	\`telegram_username\` text,
  	\`connected_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`managers_invite_token_idx\` ON \`managers\` (\`invite_token\`);`)
  await db.run(sql`CREATE INDEX \`managers_updated_at_idx\` ON \`managers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`managers_created_at_idx\` ON \`managers\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`orders\` ADD \`accepted_by_id\` integer REFERENCES managers(id);`)
  await db.run(sql`ALTER TABLE \`orders\` ADD \`closed_by_id\` integer REFERENCES managers(id);`)
  await db.run(sql`ALTER TABLE \`orders\` ADD \`telegram\` text;`)
  await db.run(sql`CREATE INDEX \`orders_accepted_by_idx\` ON \`orders\` (\`accepted_by_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_closed_by_idx\` ON \`orders\` (\`closed_by_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`managers_id\` integer REFERENCES managers(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_managers_id_idx\` ON \`payload_locked_documents_rels\` (\`managers_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`managers\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`number\` numeric,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`accepted_at\` text,
  	\`closed_at\` text,
  	\`locale\` text,
  	\`customer_name\` text NOT NULL,
  	\`customer_phone\` text NOT NULL,
  	\`customer_address\` text NOT NULL,
  	\`customer_comment\` text,
  	\`phone\` text,
  	\`subtotal\` numeric,
  	\`shipping\` numeric,
  	\`total\` numeric,
  	\`note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_orders\`("id", "title", "number", "status", "accepted_at", "closed_at", "locale", "customer_name", "customer_phone", "customer_address", "customer_comment", "phone", "subtotal", "shipping", "total", "note", "updated_at", "created_at") SELECT "id", "title", "number", "status", "accepted_at", "closed_at", "locale", "customer_name", "customer_phone", "customer_address", "customer_comment", "phone", "subtotal", "shipping", "total", "note", "updated_at", "created_at" FROM \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`ALTER TABLE \`__new_orders\` RENAME TO \`orders\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`orders_number_idx\` ON \`orders\` (\`number\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
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
  	\`instagram_posts_id\` integer,
  	\`orders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`moods_id\`) REFERENCES \`moods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sale_points_id\`) REFERENCES \`sale_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`point_categories_id\`) REFERENCES \`point_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`custom_sections_id\`) REFERENCES \`custom_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`instagram_posts_id\`) REFERENCES \`instagram_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "product_categories_id", "moods_id", "sale_points_id", "point_categories_id", "custom_sections_id", "reviews_id", "instagram_posts_id", "orders_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "products_id", "product_categories_id", "moods_id", "sale_points_id", "point_categories_id", "custom_sections_id", "reviews_id", "instagram_posts_id", "orders_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_instagram_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`instagram_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
}
