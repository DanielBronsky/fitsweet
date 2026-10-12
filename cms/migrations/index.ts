import * as migration_20260929_160422_initial from './20260929_160422_initial';
import * as migration_20260930_144232_remove_seo_indexing from './20260930_144232_remove_seo_indexing';
import * as migration_20261005_185015_image_field_crops from './20261005_185015_image_field_crops';
import * as migration_20261005_190912_bilingual_fields from './20261005_190912_bilingual_fields';
import * as migration_20261005_191636_header from './20261005_191636_header';
import * as migration_20261005_192825_fonts from './20261005_192825_fonts';
import * as migration_20261005_194020_font_weights from './20261005_194020_font_weights';
import * as migration_20261008_091014_hero from './20261008_091014_hero';
import * as migration_20261008_092204_media_rotate from './20261008_092204_media_rotate';
import * as migration_20261008_094748_catalog_products from './20261008_094748_catalog_products';
import * as migration_20261008_101109_moods_layout from './20261008_101109_moods_layout';
import * as migration_20261008_161552_catalog_blend from './20261008_161552_catalog_blend';
import * as migration_20261008_162643_where_to_buy from './20261008_162643_where_to_buy';
import * as migration_20261008_163556_delivery from './20261008_163556_delivery';
import * as migration_20261008_165946_custom_sections from './20261008_165946_custom_sections';
import * as migration_20261008_170133_category_weight_label from './20261008_170133_category_weight_label';
import * as migration_20261009_101228_box from './20261009_101228_box';
import * as migration_20261009_102254_favicon from './20261009_102254_favicon';
import * as migration_20261009_103243_reviews from './20261009_103243_reviews';
import * as migration_20261009_104704_instagram from './20261009_104704_instagram';
import * as migration_20261009_111625_instagram_layout from './20261009_111625_instagram_layout';
import * as migration_20261009_165312_orders from './20261009_165312_orders';
import * as migration_20261009_165855_telegram_managers from './20261009_165855_telegram_managers';
import * as migration_20261012_091653_manager_pause from './20261012_091653_manager_pause';
import * as migration_20261012_210716_final_cta from './20261012_210716_final_cta';
import * as migration_20261012_211426_footer from './20261012_211426_footer';
import * as migration_20261012_211946_fonts_cta_footer from './20261012_211946_fonts_cta_footer';
import * as migration_20261012_212425_order_number_search from './20261012_212425_order_number_search';
import * as migration_20261012_214356_admin_2fa from './20261012_214356_admin_2fa';
import * as migration_20261012_221150_local_seo from './20261012_221150_local_seo';

export const migrations = [
  {
    up: migration_20260929_160422_initial.up,
    down: migration_20260929_160422_initial.down,
    name: '20260929_160422_initial',
  },
  {
    up: migration_20260930_144232_remove_seo_indexing.up,
    down: migration_20260930_144232_remove_seo_indexing.down,
    name: '20260930_144232_remove_seo_indexing',
  },
  {
    up: migration_20261005_185015_image_field_crops.up,
    down: migration_20261005_185015_image_field_crops.down,
    name: '20261005_185015_image_field_crops',
  },
  {
    up: migration_20261005_190912_bilingual_fields.up,
    down: migration_20261005_190912_bilingual_fields.down,
    name: '20261005_190912_bilingual_fields',
  },
  {
    up: migration_20261005_191636_header.up,
    down: migration_20261005_191636_header.down,
    name: '20261005_191636_header',
  },
  {
    up: migration_20261005_192825_fonts.up,
    down: migration_20261005_192825_fonts.down,
    name: '20261005_192825_fonts',
  },
  {
    up: migration_20261005_194020_font_weights.up,
    down: migration_20261005_194020_font_weights.down,
    name: '20261005_194020_font_weights',
  },
  {
    up: migration_20261008_091014_hero.up,
    down: migration_20261008_091014_hero.down,
    name: '20261008_091014_hero',
  },
  {
    up: migration_20261008_092204_media_rotate.up,
    down: migration_20261008_092204_media_rotate.down,
    name: '20261008_092204_media_rotate',
  },
  {
    up: migration_20261008_094748_catalog_products.up,
    down: migration_20261008_094748_catalog_products.down,
    name: '20261008_094748_catalog_products',
  },
  {
    up: migration_20261008_101109_moods_layout.up,
    down: migration_20261008_101109_moods_layout.down,
    name: '20261008_101109_moods_layout',
  },
  {
    up: migration_20261008_161552_catalog_blend.up,
    down: migration_20261008_161552_catalog_blend.down,
    name: '20261008_161552_catalog_blend',
  },
  {
    up: migration_20261008_162643_where_to_buy.up,
    down: migration_20261008_162643_where_to_buy.down,
    name: '20261008_162643_where_to_buy',
  },
  {
    up: migration_20261008_163556_delivery.up,
    down: migration_20261008_163556_delivery.down,
    name: '20261008_163556_delivery',
  },
  {
    up: migration_20261008_165946_custom_sections.up,
    down: migration_20261008_165946_custom_sections.down,
    name: '20261008_165946_custom_sections',
  },
  {
    up: migration_20261008_170133_category_weight_label.up,
    down: migration_20261008_170133_category_weight_label.down,
    name: '20261008_170133_category_weight_label',
  },
  {
    up: migration_20261009_101228_box.up,
    down: migration_20261009_101228_box.down,
    name: '20261009_101228_box',
  },
  {
    up: migration_20261009_102254_favicon.up,
    down: migration_20261009_102254_favicon.down,
    name: '20261009_102254_favicon',
  },
  {
    up: migration_20261009_103243_reviews.up,
    down: migration_20261009_103243_reviews.down,
    name: '20261009_103243_reviews',
  },
  {
    up: migration_20261009_104704_instagram.up,
    down: migration_20261009_104704_instagram.down,
    name: '20261009_104704_instagram',
  },
  {
    up: migration_20261009_111625_instagram_layout.up,
    down: migration_20261009_111625_instagram_layout.down,
    name: '20261009_111625_instagram_layout',
  },
  {
    up: migration_20261009_165312_orders.up,
    down: migration_20261009_165312_orders.down,
    name: '20261009_165312_orders',
  },
  {
    up: migration_20261009_165855_telegram_managers.up,
    down: migration_20261009_165855_telegram_managers.down,
    name: '20261009_165855_telegram_managers',
  },
  {
    up: migration_20261012_091653_manager_pause.up,
    down: migration_20261012_091653_manager_pause.down,
    name: '20261012_091653_manager_pause',
  },
  {
    up: migration_20261012_210716_final_cta.up,
    down: migration_20261012_210716_final_cta.down,
    name: '20261012_210716_final_cta',
  },
  {
    up: migration_20261012_211426_footer.up,
    down: migration_20261012_211426_footer.down,
    name: '20261012_211426_footer',
  },
  {
    up: migration_20261012_211946_fonts_cta_footer.up,
    down: migration_20261012_211946_fonts_cta_footer.down,
    name: '20261012_211946_fonts_cta_footer',
  },
  {
    up: migration_20261012_212425_order_number_search.up,
    down: migration_20261012_212425_order_number_search.down,
    name: '20261012_212425_order_number_search',
  },
  {
    up: migration_20261012_214356_admin_2fa.up,
    down: migration_20261012_214356_admin_2fa.down,
    name: '20261012_214356_admin_2fa',
  },
  {
    up: migration_20261012_221150_local_seo.up,
    down: migration_20261012_221150_local_seo.down,
    name: '20261012_221150_local_seo'
  },
];
