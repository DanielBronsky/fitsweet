import path from "path"
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`products_moods\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_moods_order_idx\` ON \`products_moods\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_moods_parent_idx\` ON \`products_moods\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
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
  await db.run(sql`CREATE INDEX \`products__order_idx\` ON \`products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_picture_picture_image_idx\` ON \`products\` (\`picture_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`catalog\` (
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
  	\`cards_name_font\` text,
  	\`cards_name_weight\` text,
  	\`cards_add_text_ru\` text NOT NULL,
  	\`cards_add_text_ro\` text NOT NULL,
  	\`cards_added_text_ru\` text NOT NULL,
  	\`cards_added_text_ro\` text NOT NULL,
  	\`cards_button_color\` text DEFAULT 'green-700',
  	\`cards_button_active\` text DEFAULT 'green-700',
  	\`more_show\` integer DEFAULT true,
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
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)

  const products = [
    {
      "slug": "snickers-peanut",
      "name": {
        "ru": "Сникерс с арахисом",
        "ro": "Snickers cu arahide"
      },
      "price": 55,
      "weight": 55,
      "kcal": 212,
      "protein": 7.4,
      "fat": 14.8,
      "carbs": 13.6,
      "ingredients": {
        "ru": "тофу, арахисовая паста, арахис, кокосовый сахар, эритрит, кокосовое масло, псиллиум, вода, какао масло, какао порошок, сироп цикория",
        "ro": "tofu, pastă de arahide, arahide, zahăr de cocos, eritritol, ulei de cocos, psyllium, apă, unt de cacao, pudră de cacao, sirop de cicoare"
      },
      "moods": [
        "chocolate"
      ],
      "imageFile": "snickers-peanut.svg"
    },
    {
      "slug": "snickers-almond",
      "name": {
        "ru": "Сникерс с миндалем",
        "ro": "Snickers cu migdale"
      },
      "price": 65,
      "weight": 55,
      "kcal": 218,
      "protein": 6.8,
      "fat": 15.9,
      "carbs": 12.9,
      "ingredients": {
        "ru": "тофу, миндальная паста, миндаль, кокосовый сахар, эритрит, кокосовое масло, псиллиум, вода, какао масло, какао порошок, сироп цикория",
        "ro": "tofu, pastă de migdale, migdale, zahăr de cocos, eritritol, ulei de cocos, psyllium, apă, unt de cacao, pudră de cacao, sirop de cicoare"
      },
      "moods": [
        "chocolate"
      ],
      "imageFile": "snickers-almond.svg"
    },
    {
      "slug": "bounty",
      "name": {
        "ru": "Баунти",
        "ro": "Bounty"
      },
      "price": 50,
      "weight": 40,
      "kcal": 176,
      "protein": 1.9,
      "fat": 13.4,
      "carbs": 11.2,
      "ingredients": {
        "ru": "кокосовая стружка, кокосовое молоко, сироп цикория, какао масло, какао порошок",
        "ro": "fulgi de cocos, lapte de cocos, sirop de cicoare, unt de cacao, pudră de cacao"
      },
      "moods": [
        "coconut"
      ],
      "imageFile": "bounty.svg"
    },
    {
      "slug": "twix",
      "name": {
        "ru": "Twix",
        "ro": "Twix"
      },
      "price": 40,
      "weight": 45,
      "kcal": 195,
      "protein": 3.2,
      "fat": 12.6,
      "carbs": 17.4,
      "ingredients": {
        "ru": "миндальная мука, кокосовый сахар, нутовая мука, сироп цикория, кокосовое масло, сухое кокосовое молоко, какао масло, какао порошок",
        "ro": "făină de migdale, zahăr de cocos, făină de năut, sirop de cicoare, ulei de cocos, lapte de cocos praf, unt de cacao, pudră de cacao"
      },
      "moods": [
        "caramel"
      ],
      "imageFile": "twix.svg"
    },
    {
      "slug": "mars",
      "name": {
        "ru": "Марс",
        "ro": "Mars"
      },
      "price": 60,
      "weight": 45,
      "kcal": 201,
      "protein": 3.8,
      "fat": 13.1,
      "carbs": 16.2,
      "ingredients": {
        "ru": "кокосовая мука, миндальная паста, сироп цикория, кокосовое масло, эритрит, миндальная мука, какао порошок, псиллиум, какао масло, кэроб",
        "ro": "făină de cocos, pastă de migdale, sirop de cicoare, ulei de cocos, eritritol, făină de migdale, pudră de cacao, psyllium, unt de cacao, carob"
      },
      "moods": [
        "chocolate"
      ],
      "imageFile": "mars.svg"
    },
    {
      "slug": "iriska-pistachio-raspberry",
      "name": {
        "ru": "Ириска с фисташкой и малиной",
        "ro": "Caramea cu fistic și zmeură"
      },
      "shortName": {
        "ru": "Ириска",
        "ro": "Caramea"
      },
      "price": 35,
      "weight": 35,
      "kcal": 168,
      "protein": 2.6,
      "fat": 12.9,
      "carbs": 10.4,
      "ingredients": {
        "ru": "кокосовый сахар, какао масло, какао порошок, сироп цикория, кокосовое масло, кокосовое молоко, фисташка, сублимированная малина, соль, кэроб",
        "ro": "zahăr de cocos, unt de cacao, pudră de cacao, sirop de cicoare, ulei de cocos, lapte de cocos, fistic, zmeură liofilizată, sare, carob"
      },
      "moods": [
        "caramel"
      ],
      "imageFile": "iriska.svg"
    },
    {
      "slug": "mango-raspberry",
      "name": {
        "ru": "Манго-малина",
        "ro": "Mango-zmeură"
      },
      "price": 60,
      "weight": 40,
      "kcal": 152,
      "protein": 1.4,
      "fat": 9.8,
      "carbs": 14.1,
      "ingredients": {
        "ru": "манго, эритрит, сухое кокосовое молоко, инулин, кокосовое масло, малина, агар, какао масло, какао порошок, сироп цикория, кэроб",
        "ro": "mango, eritritol, lapte de cocos praf, inulină, ulei de cocos, zmeură, agar, unt de cacao, pudră de cacao, sirop de cicoare, carob"
      },
      "moods": [
        "fruity"
      ],
      "imageFile": "mango-raspberry.svg"
    },
    {
      "slug": "almond-cranberry",
      "name": {
        "ru": "Миндаль-клюква",
        "ro": "Migdale-merișoare"
      },
      "price": 40,
      "weight": 37,
      "kcal": 183,
      "protein": 2,
      "fat": 14.5,
      "carbs": 12.5,
      "ingredients": {
        "ru": "кокосовый сахар, кокосовое масло, миндальная паста, миндаль, клюква вяленая, вода, кокосовая стружка, какао масло, какао порошок, сироп цикория",
        "ro": "zahăr de cocos, ulei de cocos, pastă de migdale, migdale, merișoare uscate, apă, fulgi de cocos, unt de cacao, pudră de cacao, sirop de cicoare"
      },
      "moods": [
        "nuts-berries"
      ],
      "imageFile": "almond-cranberry.svg"
    }
  ]

  for (const p of products) {
    const { imageFile, ...data } = p
    const media = await payload.create({
      collection: "media",
      req,
      filePath: path.resolve("public/images/products", imageFile),
      data: { alt: { ru: `ПП-батончик FitSweet «${p.name.ru}»`, ro: `Baton sănătos FitSweet «${p.name.ro}»` } },
    })
    await payload.create({
      collection: "products",
      req,
      data: { ...data, active: true, picture: { image: media.id } } as never,
    })
  }

  await payload.updateGlobal({
    slug: "catalog",
    req,
    data: {
      section: { show: true, background: "white" },
      heading: { text: { ru: "Наши десерты", ro: "Deserturile noastre" }, color: "green-900", leafColor: "green-500", leaf: true },
      cards: {
        background: "card",
        nameColor: "green-900",
        infoColor: "muted",
        priceColor: "green-900",
        addText: { ru: "В корзину", ro: "În coș" },
        addedText: { ru: "Добавлено ✓", ro: "Adăugat ✓" },
        buttonColor: "green-700",
        buttonActive: "green-700",
      },
      more: {
        show: true,
        text: { ru: "Смотреть весь ассортимент", ro: "Vezi tot sortimentul" },
        background: "white",
        color: "green-900",
        border: "green-200",
      },
    },
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`products_moods\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`catalog\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
