import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`search\` text,
  	\`number\` text,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`accepted_by_id\` integer,
  	\`accepted_at\` text,
  	\`closed_by_id\` integer,
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
  	\`telegram\` text,
  	\`note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`accepted_by_id\`) REFERENCES \`managers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`closed_by_id\`) REFERENCES \`managers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_orders\`("id", "title", "number", "status", "accepted_by_id", "accepted_at", "closed_by_id", "closed_at", "locale", "customer_name", "customer_phone", "customer_address", "customer_comment", "phone", "subtotal", "shipping", "total", "telegram", "note", "updated_at", "created_at") SELECT "id", "title", "number", "status", "accepted_by_id", "accepted_at", "closed_by_id", "closed_at", "locale", "customer_name", "customer_phone", "customer_address", "customer_comment", "phone", "subtotal", "shipping", "total", "telegram", "note", "updated_at", "created_at" FROM \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`ALTER TABLE \`__new_orders\` RENAME TO \`orders\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`orders_search_idx\` ON \`orders\` (\`search\`);`)
  await db.run(sql`CREATE INDEX \`orders_number_idx\` ON \`orders\` (\`number\`);`)
  await db.run(sql`CREATE INDEX \`orders_accepted_by_idx\` ON \`orders\` (\`accepted_by_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_closed_by_idx\` ON \`orders\` (\`closed_by_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`number\` numeric,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`accepted_by_id\` integer,
  	\`accepted_at\` text,
  	\`closed_by_id\` integer,
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
  	\`telegram\` text,
  	\`note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`accepted_by_id\`) REFERENCES \`managers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`closed_by_id\`) REFERENCES \`managers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_orders\`("id", "title", "number", "status", "accepted_by_id", "accepted_at", "closed_by_id", "closed_at", "locale", "customer_name", "customer_phone", "customer_address", "customer_comment", "phone", "subtotal", "shipping", "total", "telegram", "note", "updated_at", "created_at") SELECT "id", "title", "number", "status", "accepted_by_id", "accepted_at", "closed_by_id", "closed_at", "locale", "customer_name", "customer_phone", "customer_address", "customer_comment", "phone", "subtotal", "shipping", "total", "telegram", "note", "updated_at", "created_at" FROM \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`ALTER TABLE \`__new_orders\` RENAME TO \`orders\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`orders_number_idx\` ON \`orders\` (\`number\`);`)
  await db.run(sql`CREATE INDEX \`orders_accepted_by_idx\` ON \`orders\` (\`accepted_by_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_closed_by_idx\` ON \`orders\` (\`closed_by_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
}
